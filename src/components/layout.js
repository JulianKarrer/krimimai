
import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { getImage, GatsbyImage } from "gatsby-plugin-image"
import "./layout.css"

const Layout = ({ children, style, bg_override }) => {

  const data = useStaticQuery(graphql`
    query BgColourQuery {
      contentYaml {
        bg_colour
        partner_list {
          partner_obj {
            partner_name
            partner_link
            partner_image {
              childImageSharp {
                # fixed width: 200, see --partner-size: 200px in layout.css: .partner-tile
                gatsbyImageData(width: 200)
              }
            }
          }
        }
      }
    }
  `)
  const { contentYaml } = data
  const { bg_colour, partner_list } = contentYaml
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
          <main style={{ position: "relative" }} id="main">{children}</main>
          <footer style={{ marginTop: "calc(2 * var(--content-gutter))" }}>
            <div className="footer-grid">
              <div className="footer-cell"><span>Pressematerial herunterladen</span></div>
              <div className="footer-cell"><span><Link to={"/impressum"} draggable={false}>Impressum / Datenschutz</Link></span></div>
            </div>

            <div className="footer-grid footer-grid-15">
              <div className="footer-cell" style={{
                paddingTop: "20px",
                // alignItems: "flex-start",
              }}><span>Partner</span></div>
              <div className="footer-cell footer-cell-sm-nolborder">
                <div className="partner-container">
                  {partner_list.map((o, i) => {
                    const { partner_obj } = o
                    const { partner_image, partner_name, partner_link } = partner_obj

                    return partner_image?.childImageSharp && <a
                      target="_blank" rel="noopener noreferrer"
                      href={partner_link}
                      draggable={false}
                      className="partner-tile"
                      key={"partner" + i}
                    ><GatsbyImage
                        draggable={false}
                        image={getImage(partner_image)}
                        alt={partner_name}
                        style={{
                          display: "block",
                          marginLeft: "auto",
                          marginRight: "auto",
                        }}
                      />
                    </a>
                  })}
                  {/* <StaticImage src="../images/partners/mm.jpg" width={40} /> */}
                </div>
              </div>
            </div>
          </footer>
        </div >
      </div >
    </>
  )
}

export default Layout
