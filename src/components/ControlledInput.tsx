import React, { Component } from "react";
import { INPUT_VIEW_DIRECTION } from "../Utility/Enum";
import { DKLabel } from "./common";
export interface IControlledInputProps {
  name?: string;
  placeHolder?: string;
  className?: string;
  value?: any;
  type?: string;
  invalid?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  direction?: string;
  invalidMessage?: string;
  onChange?: (e) => void;
  onKeyPress?: (e) => void;
  onKeyDown?: (e) => void;
}
export interface IControlledInputState {}
class ControlledInput extends Component<
  IControlledInputProps,
  IControlledInputState
> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
      invalid: nextProps.invalid,
    });
  }

  render() {
    const dirClassName =
      this.props.direction === INPUT_VIEW_DIRECTION.HORIZONTAL
        ? "dk-chat-row dk-chat-justify-content-between dk-chat-align-items-start dk-chat-position-relative "
        : "dk-chat-column dk-chat-parent-width ";
    return (
      <div className={`${dirClassName} ${this.props.className}`}>
        {this.props.name && this.getIconTitle()}
        {this.getValueSection()}
      </div>
    );
  }

  getIconTitle() {
    return (
      <div className="dk-chat-mr-l">
        <div className="dk-chat-row dk-chat-mt-r dk-chat-mb-s ">
          <DKLabel
            className="unselectable"
            style={{ whiteSpace: "nowrap" }}
            text={`${this.props.name} ${this.props.required ? "*" : ""}`}
          />
        </div>
      </div>
    );
  }

  getValueSection() {
    return (
      <div
        className={`dk-chat-parent-width  ${
          this.props.direction === INPUT_VIEW_DIRECTION.VERTICAL ? "dk-chat-mt-ss" : ""
        }`}
        style={
          this.props.direction === INPUT_VIEW_DIRECTION.HORIZONTAL
            ? { width: 300 }
            : {}
        }
      >
        {this.getInputSection()}
        {this.props.invalid && (
          <DKLabel
            text={
              this.props.invalidMessage
                ? this.props.invalidMessage
                : `Enter a valid ${this.props?.name?.toLowerCase() || `value`}`
            }
            className="dk-chat-text-red dk-chat-mt-s dk-chat-ml-xs"
            style={{ fontSize: 11 }}
          />
        )}
      </div>
    );
  }

  getInputSection() {
    const style = {
      input: {
        outline: "none",
        backgroundColor: "transparent",
        top: 0,
        left: 0,
      },
      inputWrapper: { top: 0, left: 0, height: 40 },
      parentWrapper: { minHeight: 35 },
    };
    return (
      <div
        className={
          "dk-chat-parent-width dk-chat-border-box dk-chat-bg-gray1 dk-chat-border-radius-s dk-chat-p-s dk-chat-position-relative " +
          (this.props.invalid ? " dk-chat-border-red" : "")
        }
        style={style.parentWrapper}
      >
        <div
          className={"dk-chat-position-absolute dk-chat-parent-width"}
          style={style.inputWrapper}
        >
          <input
            style={style.input}
            autoFocus={this.props.autoFocus}
            spellCheck={false}
            placeholder={this.props.placeHolder ? this.props.placeHolder : ""}
            value={this.props.value}
            type={this.props.type ? this.props.type : "text"}
            disabled={this.props.readOnly}
            readOnly={this.props.readOnly}
            className={`dk-chat-position-absolute dk-chat-border-none dk-chat-app-font dk-chat-parent-width dk-chat-p-s dk-chat-border-box`}
            onChange={(e) =>
              this.props.onChange ? this.props.onChange(e) : null
            }
            onKeyPress={(e) =>
              this.props.onKeyPress ? this.props.onKeyPress(e) : null
            }
            onKeyDown={(e) =>
              this.props.onKeyDown ? this.props.onKeyDown(e) : null
            }
          />
        </div>
      </div>
    );
  }
}

export default ControlledInput;
