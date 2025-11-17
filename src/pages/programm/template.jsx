import * as React from "react"
import { graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from "../../components/layout"
import LineBreak from "../../components/linebreak"
import Pfeil from "../../images/arrows/pfeil_tickets.svg"
import Slider from "../../components/slider"

function ContentHeader({ header }) {
  const valid_header = !(header === null || header === "" || header === undefined)
  return valid_header ? <>
    <div className="bordered-topless">
      <h1>{header}</h1>
    </div>
  </> : <></>
}

export default function ProgrammpunktTemplate({ data }) {
  // destructure the data passed in from the query that generated the site:

  // first get the background colour setting
  const { contentYaml } = data
  const { bg_colour_subpage } = contentYaml
  // then get the mandatory fields from the frontmatter
  const { markdownRemark } = data
  const { frontmatter } = markdownRemark
  const { name } = frontmatter
  const { author } = frontmatter
  const { ort } = frontmatter
  const { portrait_list } = frontmatter
  const { ticketlink } = frontmatter


  // get names and portraits of artists
  const portraits = portrait_list.map((img) => {
    return {
      img: getImage(img.portrait_obj.portrait_image),
      name: img.portrait_obj.portrait_name
    }
  })

  const price = parseFloat(frontmatter?.price)
  const isnt = (val) => val === null || val === undefined || val === ""
  const has_einlass = !isnt(frontmatter?.einlass)
  const has_beginn = !isnt(frontmatter?.beginn)

  return (
    <Layout style={{ background: bg_colour_subpage }}>
      {/* first container: title, name and background image */}
      <div className="container" style={{ marginBottom: 0 }}>
        {/* include portraits */}
        <Slider portraits={portraits} />
        {/* include headings */}
        <h1 style={{
          textAlign: "right",
          position: "absolute",
          top: 0,
          right: 0,
          marginLeft: "10vmin"
        }} className="tight">{name}</h1>

        <h1 style={{
          textAlign: "left",
          position: "absolute",
          bottom: 0,
          left: 0,
        }} className="tight">
          {author}
        </h1>

        <div style={{
          width: "10vmin",
          left:0,
          top:0,
          position: "absolute",
          margin: "var(--inner-padding)",
          transform: "rotate(0.5turn)",
        }}>
          <Link to={"/"}  draggable={false}>
          <Pfeil />
          </Link>
        </div>
      </div>

      {/* event overview */}
      <div className="bordered halved-mobilefull" style={{ marginTop: 0, borderTop: 0 }}>
        <div className="padded">
          {/* conditionally render einlass and begin fields, their seperator and a linebreak */}
          {has_einlass ? <>{frontmatter.einlass.split("T").at(-1)} Einlass</> : <></>}
          {has_einlass && has_beginn ? <> / </> : <></>}
          {has_beginn ? <>{frontmatter.beginn.split("T").at(-1)} Beginn</> : <></>}
          {has_einlass || has_beginn ? <br /> : <></>}
          {/* always print field ort */}
          <LineBreak text={ort} />
          {/* conditionally linebreak and render price, rounding to 2 decimal places if not an integer */}
          {
            // check if price is a number
            price ?
              <><br />Preis: {
                Number.isInteger(price) ?
                  // price is already an integer
                  price :
                  // or round to two decimal places and cut off
                  // https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding
                  (+(Math.round(+(price + 'e' + 2)) + 'e' + -2)).toFixed(2)
              }€</>
              // if price is not present, render nothing
              : <></>}
        </div>
        {/* ticket link */}
        <div className="padded right-half-border">
          <a className=" vcentre vcentred" target="_blank" rel="noopener noreferrer" href={ticketlink}>
            <h1 style={{ padding: 0, whiteSpace: "nowrap" }}>
              <span className="arrow-container"><Pfeil /></span>TICKETS
            </h1>
          </a>
        </div>
      </div>

      {/* page contents */}

      {frontmatter?.contents ? frontmatter?.contents.map(({ segment }, i) => <>
        <ContentHeader key={"content-header" + i} header={segment.segment_title}></ContentHeader>
        <div className="bordered-topless padded halved-mobilefull" key={"content-block" + i}>
          {segment.segment_contents.map((block, j) => {
            return <div className="block-container">
              {block.block_text ?
                <LineBreak text={block.block_text} />
                : <></>}
              {block.block_image ?
                <div className="content-img-container">
                  <GatsbyImage
                    image={getImage(block.block_image)}
                    alt="Bild" />
                </div>
                : <></>}
            </div>
          })}
        </div >
      </>)
        : <></>}

    </Layout >
  )
}

export const query = graphql`
  query ($id: String) {
    markdownRemark(id: {eq: $id}) {
      frontmatter {
        author
        beginn
        einlass
        name
        ort
        contents {
          segment {
            segment_contents {
              block_text
              type
              block_image {
                childImageSharp {
                  gatsbyImageData(layout: CONSTRAINED)
                }
              }
            }
            segment_title
          }
        }
        portrait_list {
          portrait_obj {
            portrait_name
            portrait_image {
              childImageSharp {
                gatsbyImageData(layout: CONSTRAINED)
              }
            }
          }
        }
        price
        ticketlink
        title
      }
    }
    contentYaml {
      bg_colour_subpage
    }
  }
`