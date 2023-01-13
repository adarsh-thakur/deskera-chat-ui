import { IDKButtonProps } from "./DKButton";
import DKIcon from "./DKIcon";

export interface IDKChipButtonProps extends IDKButtonProps {
  accentColor?: string;
  opacity?: string;
}

export function DKChipButton(props: IDKChipButtonProps) {
  return (
    <div
      className={
        (props.isReverse ? "dk-chat-row-reverse" : "dk-chat-row") +
        " dk-chat-border-radius-m dk-chat-text-wrap-none dk-chat-p-v-s dk-chat-chip-button-hover dk-chat-position-relative " +
        props.className
      }
      style={{
        ...{
          width: "auto",
          paddingLeft: props.title ? 12 : 8,
          paddingRight: props.title ? 12 : 8,
          cursor: props.disabled ? "auto" : "pointer",
          userSelect: "none",
          overflow: "hidden"
        },
        ...props.style
      }}
      onClick={props?.onClick && !props.disabled ? props.onClick : null}
    >
      <div
        className="dk-chat-position-absolute dk-chat-row dk-chat-parent-size dk-chat-flex-1 dk-chat-opacity-2 "
        style={{
          flexShrink: 0,
          top: 0,
          right: 0,
          zIndex: 0,
          backgroundColor: props.accentColor || "rgb(210, 228, 249)"
        }}
      ></div>
      {props.icon && (
        <DKIcon className="dk-chat-ic-s dk-chat-z-index-1" src={props.icon} />
      )}
      {props.icon && props.title && (
        <div
          style={{ width: props.isReverse ? 5 : 8 }}
          className=" dk-chat-z-index-1"
        />
      )}
      <text 
        className="dk-chat-text-align-left dk-chat-text-wrap-none dk-chat-unselectable dk-chat-z-index-1" 
        style={{
            color: props.accentColor || "rgb(22, 100, 215)"
        }}
       >
        {props.title}
      </text>
    </div>
  );
}
