/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/
 */

/**
 * @type {import('gatsby').GatsbyNode['createPages']}
 */

const slugify = require('slugify')
const path = require(`path`)

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const programmTemplate = path.resolve(`src/pages/programm/template.jsx`)
  const result = await graphql(`
    query ProgrammQuery {
      allMarkdownRemark {
        nodes {
          id
          frontmatter {
            name
          }
        }
      }
    }
  `)
  const { data } = result
  const { allMarkdownRemark } = data
  const { nodes } = allMarkdownRemark
  nodes.forEach(node => {
    createPage({
      path: "programm/" + slugify(node.frontmatter.name, { lower: true }),
      component: programmTemplate,
      context: {
        id: node.id
      }
    })
  });
}
