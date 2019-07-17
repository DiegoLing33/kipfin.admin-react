import React from "react";

/**
 * Леблированный текст
 * @param props
 * @constructor
 */
export default function LabelText(props: { text: string, fullPadding?: boolean  }) {
    let paddingTop = (props.fullPadding === undefined || props.fullPadding) ? 15 : 0;
    return <div style={{textAlign: "center", padding: 15, paddingTop: paddingTop, opacity: 0.5}}>{props.text}</div>;
}