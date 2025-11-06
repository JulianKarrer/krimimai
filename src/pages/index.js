import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { Link } from "gatsby"
import { getImage, GatsbyImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

import * as styles from "./index.module.css"

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
      }
      allMarkdownRemark {
        nodes {
          frontmatter {
            sorting
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
  const { date, bg_colour_subpage } = contentYaml
  const { nodes } = allMarkdownRemark
  const programmpunkte = nodes.map(({ frontmatter }) => (frontmatter))
    .sort((ia, ib) => {
      const a = ia.sorting
      const b = ib.sorting
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
      <div className="bordered">
        <h1 style={{ borderBottom: "var(--border)" }}>Programm</h1>
        <p style={{ padding: "var(--inner-padding)" }}>
          Der mörderische Mai hat einiges zu bieten.<br />
          Folgende Tatorte sind geplant:
        </p>
        <div className="programm-grid">
          {programmpunkte.map((punkt) => <ProgrammPunkt programmpunkt={punkt} bg_colour={bg_colour_subpage} />)}
        </div>
      </div>


    </Layout>
  )
}

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
