import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"
import Pfeil from "../images/arrows/pfeil_rechts.svg"

import * as styles from "./index.module.css"
import LineBreak from "../components/linebreak"

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
    <div style={{ background: bg_colour, border: "var(--border)", ...style }} className={className}>
      {/* portraits */}
      <Link to={linkto}>
        <div style={{ aspectRatio: 1 }}>
          <div className="portraits-container">
            {portraits.map(({ img, name }, i) => <GatsbyImage
              image={img}
              alt={name}
              key={name + i}
              className="portrait"
            />)}
          </div>
        </div>
        {/* first box: name of the event */}
        <div style={{ borderTop: "var(--border)", padding: "var(--small-padding)" }}>
          <h3>{programmpunkt.name}</h3>
        </div>
      </Link>
      {/* second box: all the remaining info */}
      <div style={{ borderTop: "var(--border)", padding: "var(--small-padding)" }}>
        <span style={{ marginBottom: "50px" }}>{programmpunkt.author}</span>
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
            einlass
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
  console.log(ueber_uns_text)
  const programmpunkte = nodes.map(({ frontmatter }) => (frontmatter))
    .sort((ia, ib) => {
      const a = ia.beginn
      const b = ib.beginn
      return a >= b ? 1 : (
        a <= b ? 0 : -1
      )
    })

  return (
    <Layout>
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
      </div >

      {/* programm */}
      <div className="bordered" style={{ paddingBottom: "var(--inner-padding)" }}>
        <h1 style={{ borderBottom: "var(--border)" }}>Programm</h1>
        <p style={{ padding: "var(--inner-padding)" }}>
          Der mörderische Mai hat einiges zu bieten.<br />
          Folgende Tatorte sind geplant:
        </p>
        <div className="programm-grid">
          {programmpunkte.map((punkt) => <ProgrammPunkt programmpunkt={punkt} bg_colour={bg_colour_subpage} />)}
        </div>
      </div>

      {/* instagram link */}
      <div className="container vcentre" style={{ border: "none" }}>
        <div className="bordered" style={{ width: "100%" }}>

          <h1 style={{
            lineHeight: "var(--line-height-medium-dense)"
          }}>Aktuelle Infos<br />auf <a className="" target="_blank" rel="noopener noreferrer" href={instagram_link_landing} style={{
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
        }}>
          <h1 style={{ textAlign: "right", paddingTop: 0 }}>
            <span className="arrow-container"><Pfeil /></span>KOBR.DE
          </h1>
        </a>
      </div>

    </Layout >
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Krimimai" />

export default IndexPage
