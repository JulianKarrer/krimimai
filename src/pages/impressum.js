import * as React from "react"
import Layout from "../components/layout"
import Seo from "../components/seo"
import LineBreak from "../components/linebreak"
import { useStaticQuery, graphql } from "gatsby"


const ImpressumPage = () => {
    const data = useStaticQuery(graphql`
        query ImpressumPageQuery {
          contentYaml {
            impressum_text
            datenschutz_text
            bg_colour_impressum
          }
        }
    `)
    const { contentYaml } = data
    const { impressum_text, datenschutz_text, bg_colour_impressum } = contentYaml
    console.log(data)
    return (
        <Layout bg_override={bg_colour_impressum}>
            <div className="container-scaling">
                <h1>Impressum</h1>
                <p style={{ padding: "var(--inner-padding)", paddingTop: 0, }}>
                    <LineBreak text={impressum_text} />
                </p>
                <h1>Datenschutz</h1>
                <p style={{ padding: "var(--inner-padding)", paddingTop: 0, }}>
                    <LineBreak text={datenschutz_text} />
                </p>
            </div>
        </Layout>
    )
}


export const Head = () => <Seo title="Impressum und Datenschutz" />
export default ImpressumPage