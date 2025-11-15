/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import "./layout.css"

const Layout = ({ children, style, bg_override }) => {

  const data = useStaticQuery(graphql`
    query BgColourQuery {
      contentYaml {
        bg_colour
      }
    }
  `)
  const { contentYaml } = data
  const { bg_colour } = contentYaml
  const bg = bg_override ? bg_override : bg_colour

  return (
    <>
      {/* <Header siteTitle={data.site.siteMetadata?.title || "Title"} /> */}
      {/* outer container  */}
      <div
        style={{
          margin: "0 auto",
          minHeight: "var(--min-height)",
          background: bg,
          padding: "var(--content-gutter)",
          ...style
        }}
      >
        {/* inner container */}
        <div style={{
          margin: "0 auto",
        }}>
          <main>{children}</main>
          <footer style={{ marginTop: "calc(2 * var(--content-gutter))" }}>
            <div className="footer-grid">
              <div className="footer-cell"><span>Pressematerial herunterladen</span></div>
              <div className="footer-cell"><span><Link to={"/impressum"}>Impressum / Datenschutz</Link></span></div>
            </div>

            <div className="footer-grid footer-grid-15">
              <div className="footer-cell"><span>Partner</span></div>
              <div className="footer-cell"><span>...</span></div>
            </div>
          </footer>
        </div >
      </div >
    </>
  )
}

export default Layout
