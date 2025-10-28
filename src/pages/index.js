import * as React from "react"
// import { Link } from "gatsby"
// import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

import * as styles from "./index.module.css"


const IndexPage = () => (
  <Layout>

    {/* full page header */}
    <div className={styles.container}>
      <h1 style={{
        textAlign: "right",
        position: "absolute",
        top: 0,
        right: 0,
      }}>
        Mörderischer <br />Mai
      </h1>

      <h2 className={styles.dateheader}>8. Mai bis 13. Mai</h2>

      <h1 style={{
        textAlign: "left",
        position: "absolute",
        bottom: 0,
        left: 0,
      }}>
        Allgäuer <br />Krimifestival
      </h1>
    </div >

    {/* programm */}
    <div className={styles.container}>
      <h1 style={{ borderBottom: "var(--border)" }}>Programm</h1>
      <p style={{ padding: "var(--inner-padding)" }}>
        Der mörderische Mai hat einiges zu bieten.<br />
        Folgende Tatorte sind geplant:
      </p>
    </div>


  </Layout >
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
