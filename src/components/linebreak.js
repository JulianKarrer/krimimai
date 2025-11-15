import * as React from "react"
import Markdown from 'markdown-to-jsx'

export default function LineBreak({ text, style }) {
    return (<span style={{ maxWidth: "100%", whiteSpace: "pre-wrap", ...style }}>
        <Markdown options={{
            overrides: {
                h1: {
                    props: {
                        className: 'mk-h1',
                    },
                },
                h2: {
                    props: {
                        className: 'mk-h2',
                    },
                },
                h3: {
                    props: {
                        className: 'mk-h3',
                    },
                },
            },
        }}>{text}</Markdown>
    </span>
    )
}