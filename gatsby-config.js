/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
 */

/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `Mörderischer Mai`,
    description: `Das Allgäuer Krimi-Festival`,
    author: `Krimimai`,
    siteUrl: `https://www.krimimai.de`,
  },
  plugins: [
    `gatsby-plugin-decap-cms`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/content`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `settingsimg`,
        path: `${__dirname}/content/settings`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `srcimages`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`avif`, `webp`, `auto`],
          placeholder: `blurred`,
          quality: 50,
          backgroundColor: `transparent`,
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Mörderischer Mai`,
        short_name: `krimimai`,
        start_url: `/`,
        background_color: `00A8E9`,
        // This will impact how browsers show your PWA/website
        // https://css-tricks.com/meta-theme-color-and-trickery/
        theme_color: `00A8E9`,
        display: `minimal-ui`,
        icon: `src/images/favicon.png`,
      },
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./content/`,
      },
    },
    // allow import of svg files
    {
      resolve: "gatsby-plugin-react-svg",
      // options: {
      //   rule: {
      //     include: /\.svg$/,
      //     options: {
      //       props: {
      //         className: "my-class",
      //       }
      //     }
      //   }
      // }
    }
  ],
}
