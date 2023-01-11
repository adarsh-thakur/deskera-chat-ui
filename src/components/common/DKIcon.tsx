import React, { useState } from "react";
export interface IDKIconProps {
  id?: string;
  className?: string;
  src: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  alt?: string;
  defaultSrc?: string;
}

const DKIcon = (props: IDKIconProps) => {
  const [hasError, setHasError] = useState(false);
  const className =
      "dk-chat-ic-r dk-chat-content-box " +
      (props.className ? props.className : "")
      + (hasError ? " dk-chat-p-xs " : "");

  return (
    <img
      id={props.id}
      className={className}
      src={hasError ? props.defaultSrc : props.src}
      alt={props.alt || ""}
      style={{
        ...{ objectFit: "scale-down" },
        ...props.style
      }}
      onClick={props.onClick ? props.onClick : null}
      onError={(e) => props.defaultSrc ? setHasError(true) : {}}
    />
  );
}

export default DKIcon;