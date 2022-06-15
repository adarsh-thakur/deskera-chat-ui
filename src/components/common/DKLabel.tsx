import React, { Component } from "react";

export interface IDKLabelProps {
    text?: string;
    className?: string;
    style?: React.CSSProperties;
}
export interface IDKLabelState {
    text?: string;
}

export default class DKLabel extends Component<IDKLabelProps, IDKLabelState> {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.text,
        };
    }

    componentWillReceiveProps(nextProp) {
        this.setState({
            text: nextProp.text,
        });
    }

    render() {
        return (
            <div
                className={"dk-chat-fs-r dk-chat-text-align-left " + this.props.className}
                dangerouslySetInnerHTML={{ __html: this.state.text }}
                style={{
                    ...{
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                    },
                    ...this.props.style,
                }}
            />
        );
    }
}
