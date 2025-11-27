import * as React from "react"
import { useEffect, useState } from "react";
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import { getImage, GatsbyImage, StaticImage } from "gatsby-plugin-image"
import PfeilTicket from "../images/arrows/pfeil_tickets.svg"

import useAnimationFrame from "../components/useAnimationFrame";
import useMousePosition from "../components/useMousePosition";
import useNormalizedDrag from "../components/useNormalizedDrag";
import Layout from "../components/layout"
import Seo from "../components/seo"
import Pfeil from "../images/arrows/pfeil_rechts.svg"
import Slider from "../components/slider";
import date_ger_locale from "../components/date_ger_locale";

import * as styles from "./index.module.css"
import LineBreak from "../components/linebreak"
import { useMemo } from "react";

const slugify = require('slugify')

function ProgrammPunkt({ style, className, programmpunkt, bg_colour }) {
  const portraits = programmpunkt.portrait_list.map((img) => {
    return {
      img: getImage(img.portrait_obj.portrait_image),
      name: img.portrait_obj.portrait_name
    }
  })

  const linkto = "/programm/" + slugify(programmpunkt.name, { lower: true })
  return (
    <div style={{ background: bg_colour, position: "relative", border: "var(--border)", ...style }} className={className}>
      {/* portraits */}
      <Link to={linkto} draggable={false}>
        <div style={{ aspectRatio: 1 }}>
          <div className="portraits-container">
            <Slider portraits={portraits} interval={2500} />
          </div>
        </div>
        {/* first box: name of the event */}
        <div style={{ borderTop: "var(--border)", padding: "var(--small-padding)" }}>
          <h3 style={{ lineHeight: "1.0" }}>{programmpunkt.name}</h3>
        </div>
      </Link>
      {/* second box: all the remaining info */}
      <div style={{ borderTop: "var(--border)", padding: "var(--small-padding)", marginBottom: "calc(30px + 10pt)" }}>
        <span >{programmpunkt.author}</span>
        <p style={{ fontSize: "10pt", marginTop: "20px", position: "absolute", bottom: "10px" }}>{!programmpunkt.beginn_ignore && date_ger_locale(programmpunkt.beginn)}</p>
        {programmpunkt?.ticketlink &&
          <div
            style={{ bottom: "0", position: "absolute", right: "var(--small-padding)" }}>
            <a className="vcentre vcentred" target="_blank" rel="noopener noreferrer"
              href={programmpunkt.ticketlink}>
              <span style={{ padding: 0, whiteSpace: "nowrap" }}>
                <span style={{
                  display: "inline-block", aspectRatio: 2, height: "calc(0.75 * var(--textfont-size))", marginRight: "5px"
                }}><PfeilTicket /></span>TICKETS
              </span>
            </a>
          </div>
        }
      </div>
    </div >
  )
}

const IndexPage = () => {
  const data = useStaticQuery(graphql`
     query IndexPageQuery {
      contentYaml {
        date
        bg_colour_subpage
        instagram_link_landing
        kobr_link_landing
        ueber_uns_text
        ueber_uns_image{
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
      allMarkdownRemark {
        nodes {
          frontmatter {
            author
            beginn
            beginn_ignore
            einlass
            disable
            name
            title
            ticketlink
            portrait_list {
              portrait_obj {
                portrait_name
                portrait_image {
                  childImageSharp {
                    gatsbyImageData
                  }
                }
              }
            }
          }
        }
      }
    }
`)
  const { contentYaml, allMarkdownRemark } = data
  const { date, bg_colour_subpage, instagram_link_landing, kobr_link_landing,
    ueber_uns_text, ueber_uns_image, } = contentYaml
  const { nodes } = allMarkdownRemark

  const programmpunkte = useMemo(() => {
    return nodes
      .map(({ frontmatter }) => (frontmatter))
      .filter((elem) => { return !(elem?.disable) })
      .sort((ia, ib) => {
        const a = ia.beginn.replaceAll('.', '-') // replace dot with - to confirm to 
        const b = ib.beginn.replaceAll('.', '-') // DateString format and parse to Date int
        const date_a = Date.parse(a)
        const date_b = Date.parse(b)
        // then just compare the dates via subtraction and clamp
        const res = Math.min(1, Math.max(-1, date_a - date_b))
        return res
      })
  }, [nodes])

  // get normalized mouse interaction

  const mousePosition = useMousePosition(true);
  const { drag, accum, setAccum } = useNormalizedDrag(mousePosition);

  // also track if user has not scrolled for a while
  const [lastScrollPos, setLastScrollPos] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [inactive, setInactive] = useState(false);
  const inactiveTimeout = 3

  const [trans, setTrans] = useState(`translate(0px, 0px)`);
  // const [pos, setPos] = useState({ x: 0, y: 0 });
  const [interp, setInterp] = useState({ x: 0, y: 0, rot: 0, dx: 0, dy: 0 });
  useAnimationFrame((time) => {
    const scrollY = window.scrollY
    if (scrollY !== lastScrollPos) {
      // new scroll detected, record its time and position
      setLastScrollTime(time)
      setLastScrollPos(scrollY)
      setInactive(false)
    } else if (time - lastScrollTime > inactiveTimeout) {
      // no new 
      setInactive(true)
    }

    // get scroll position
    const elem = document.getElementById("tuete")
    const ysize = elem ? elem.clientHeight : 0

    const margin = (ysize - window.innerHeight) / 2
    const height = elem ? (elem.getBoundingClientRect().top + scrollY + margin) : 0
    const scroll_fract = elem ? Math.min(1, Math.max(0, 1. - scrollY / height)) : 0

    const yoff = elem ? elem.getBoundingClientRect().top + scrollY + margin : 0
    const protectY = elem ? elem.clientHeight * 0.4 : 0

    let x = 0
    let y = -yoff * scroll_fract
    let dy = window.innerHeight * (drag.y + accum.y)
    let dx = window.innerWidth * (drag.x + accum.x) * (-(y + dy) < (protectY) ? 0.1 : 1);
    let rot = scroll_fract

    let stiffness = 0.05
    setAccum(prev => { return { x: prev.x * (1 - stiffness), y: prev.y * (1 - stiffness) }; })

    let a = 0.9
    const lerp = (f, t) => (1 - a) * f + a * t
    setInterp({
      x: lerp(x, interp.x),
      y: lerp(y, interp.y),
      rot: lerp(rot, interp.rot),
      dx: lerp(dx, interp.dx),
      dy: lerp(dy, interp.dy),
    })
  }, [drag, accum])

  useEffect(() => {
    setTrans(`translate(${interp.x + interp.dx}px, ${Math.min(0, interp.y + interp.dy)}px) rotate(${interp.rot}turn)`)
  }, [interp])



  return (<>
    <Layout style={{ overflowX: "hidden" }}>
      {/* full page header */}
      <div className="container">
        <h1 style={{
          textAlign: "right",
          position: "absolute",
          top: 0,
          right: 0,
        }} className="tight">
          Mörderischer <br />Mai
        </h1>

        <h2 className={styles.dateheader}>{date}</h2>

        <h1 style={{
          textAlign: "left",
          position: "absolute",
          bottom: 0,
          left: 0,
        }} className="tight">
          Allgäuer <br />Krimifestival
        </h1>
        {/* scroll reminder arrow on inactivity: */}
        <div style={{
          position: "absolute",
          bottom: "calc(-1 * var(--content-gutter))",
          left: "50%",
          transition: "opacity 800ms ease",
          opacity: inactive ? 0.8 : 0,
          zIndex: 4,
        }}
          className="bob"
        >
          <StaticImage draggable={false} src="../images/arrows/pfeil_runter.svg" layout="constrained" style={{ pointerEvents: "none" }} alt="Pfeil nach unten" />
        </div>
      </div >

      {/* programm */}
      <div className="bordered" style={{ paddingBottom: "var(--inner-padding)" }}>
        <h1 style={{ borderBottom: "var(--border)" }}>Programm</h1>
        <p style={{ padding: "var(--inner-padding)" }}>
          Der mörderische Mai hat einiges zu bieten.<br />
          Folgende Tatorte sind geplant:
        </p>
        <div className="programm-grid">
          {programmpunkte.map((punkt, k) => <ProgrammPunkt programmpunkt={punkt} bg_colour={bg_colour_subpage} key={k} />)}
        </div>
      </div>

      {/* instagram link */}
      <div className="container vcentre mobile-halfpage-vert" style={{ border: "none" }}>
        <div className="bordered" style={{ width: "100%" }}>

          <h1 style={{
            lineHeight: "var(--line-height-medium-dense)"
          }}>Aktuelle Infos<br />auf <a className="" target="_blank" rel="noopener noreferrer" href={instagram_link_landing} draggable={false} style={{
            position: "relative",
            color: "var(--color-text-highlight)",
            whiteSpace: "nowrap",
          }}>
              <span className="arrow-container"><Pfeil /></span>INSTAGRAM
            </a></h1>
        </div>
      </div>


      {/* über uns */}
      <div className="bordered">
        <h1 style={{ textAlign: "right" }}>Über uns</h1>
        <div className="padded halved-mobilefull"
          style={{ borderTop: "var(--border)", gridGap: "10vmin" }}
        >
          <LineBreak text={ueber_uns_text} />
          <div className="ueber-uns-image">
            <GatsbyImage
              draggable={false}
              image={getImage(ueber_uns_image)}
              alt={"Portrait: Über uns"}
              style={{
                maxWidth: 500, display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            // className="portrait"
            />
          </div>
        </div>
        <a className="" target="_blank" rel="noopener noreferrer" href={kobr_link_landing} style={{
          position: "relative",
          color: "var(--color-text-highlight)",
          whiteSpace: "nowrap",
        }} draggable={false}>
          <h1 style={{ textAlign: "right", paddingTop: 0 }}>
            <span className="arrow-container"><Pfeil /></span>KOBR.DE
          </h1>
        </a>
      </div>

      {/* pencil */}
      <StaticImage draggable={false} src="../images/bag/tuete-overlay.png" layout="constrained" style={{ zIndex: 4, pointerEvents: "none" }} className="pencil" alt="Beweistüte Beschriftung" />
      <StaticImage draggable={false} id="tuete" src="../images/bag/tuete.png" layout="constrained" style={{ zIndex: 2, pointerEvents: "none" }} className="pencil" alt="Beweistüte" />

      <div
        className="pencil"
        style={{ zIndex: 3, transform: trans }}>
        <StaticImage
          draggable={false}
          src="../images/bag/stift.png"
          layout="constrained"
          alt="blutiger Stift"
        />
      </div>


      <div style={{ height: "calc(1.4* var(--pencil-max-width))", position: "relative" }}></div>

    </Layout >
  </>
  )
}


export const Head = () => <Seo title="Krimimai" />
export default IndexPage
