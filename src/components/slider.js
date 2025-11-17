import * as React from "react"
import { useState } from "react"
import useInterval from "./useInterval"
import { GatsbyImage } from 'gatsby-plugin-image'

export default  function Slider({portraits, style, interval = 3000}){
  const [index, setIndex] = useState(0)

  useInterval(()=>{
    setIndex(idx => {
        return (idx+1) % portraits.length
    })
  }, interval)

  return (
  <div style={{
    height: "100%",
    minHeight: "100%",
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    position: "relative",
  }}>
    {portraits.map(({ img, name }, i) => <GatsbyImage
      image={img}
      alt={name}
      key={"portrait" + name + i}
      style={{
        position: "absolute",
        top: "0",
        transition: "opacity 300ms ease-out",
        opacity: i===index ? 1 : 0,
        ...style}}
      className={"portrait"}
    />)}
  </div>)
}