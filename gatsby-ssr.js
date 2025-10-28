import * as React from "react"

export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/Roboto-Medium.ttf"
      as="font"
      type="font/truetype"
      crossOrigin="anonymous"
      key="interFont"
    />,
    <link
      rel="preload"
      href="/fonts/Roboto-Medium.woff"
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
      key="interFont"
    />,
    <link
      rel="preload"
      href="/fonts/Baton-Medium.ttf"
      as="font"
      type="font/truetype"
      crossOrigin="anonymous"
      key="interFont"
    />,
    <link
      rel="preload"
      href="/fonts/Baton-Medium.woff"
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
      key="interFont"
    />,
  ])
}