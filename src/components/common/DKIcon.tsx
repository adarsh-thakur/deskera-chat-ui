import React, { Component } from "react";
export interface IDKIconProps {
  id?: string;
  className?: string;
  src: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default class DKIcon extends Component<IDKIconProps, any> {
  render() {
    const className =
      "dk-chat-ic-r dk-chat-content-box " + (this.props.className ? this.props.className : "");

    return (
      <img
        id={this.props.id}
        className={className}
        src={this.props.src}
        alt=""
        style={{
          ...{ objectFit: "scale-down" },
          ...this.props.style,
        }}
        onClick={this.props.onClick ? this.props.onClick : null}
      />
    );
  }
}
