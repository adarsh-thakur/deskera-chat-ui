import React, { Component } from "react";
import DKIcon from "./DKIcon";

export interface IDKButtonProps {
    icon?: string;
    title?: string;
    className?: string;
    style?: React.CSSProperties;
    isReverse?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}
export interface IDKButtonState {
}
export default class DKButton extends Component<IDKButtonProps, IDKButtonState> {
    componentWillReceiveProps(nextProps) {
        this.setState({
            onClick: nextProps.onClick,
            disabled: nextProps.disabled ? nextProps.disabled : false,
        });
    }
    render() {
        return (
            <div
                className={
                    (this.props.isReverse ? "dk-chat-row-reverse" : "dk-chat-row") +
                    " dk-chat-border-radius-m dk-chat-text-wrap-none dk-chat-p-v-s dk-chat-dk-button-hover " +
                    this.props.className
                }
                style={{
                    ...{
                        width: "auto",
                        paddingLeft: this.props.title ? 12 : 8,
                        paddingRight: this.props.title ? 12 : 8,
                        cursor: this.props.disabled ? "auto" : "pointer",
                        userSelect: "none",
                    },
                    ...this.props.style,
                }}
                onClick={this.props?.onClick && !this.props.disabled ? this.props.onClick : null}
            >
                {this.props.icon && <DKIcon className="dk-chat-ic-s" src={this.props.icon} />}
                {this.props.icon && this.props.title && (
                    <div style={{ width: this.props.isReverse ? 5 : 8 }} />
                )}
                <text className="dk-chat-text-align-left dk-chat-text-wrap-none dk-chat-unselectable">
                    {this.props.title}
                </text>
            </div>
        );
    }
}
