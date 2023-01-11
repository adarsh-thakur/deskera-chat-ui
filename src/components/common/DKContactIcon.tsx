import React from "react";
export interface IDKContactIconProps {
    title: string;
    className?: string;
    style?: any;
}

export default class DKContactIcon extends React.PureComponent<IDKContactIconProps, any> {
    render() {
        return (
            <div
                className={`dk-chat-column dk-chat-ic-contact-r dk-chat-justify-content-center dk-chat-align-items-center dk-chat-fs-r dk-chat-fw-b dk-chat-border-s dk-chat-circle ${this.props.className}`}
                style={{
                    ...(this.props.style || {})
                }}
            >
                {this.props.title.substring(0, 1).toUpperCase()}
            </div>
        );
    }
}
