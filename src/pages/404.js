import * as React from "react"

import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const NotFoundPage = () => (
  <Layout>
    <div className="container">
      <h1>404: Seite nicht gefunden.</h1>
      <div style={{ padding: "var(--inner-padding)" }}>
        <p>
          <span>Diese Seite wurde leider ermordet. </span>
          <Link to="/" draggable={false}>Klicken Sie hier um auf der Hauptseite zu ermitteln.</Link>
        </p>
      </div>

    </div>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
