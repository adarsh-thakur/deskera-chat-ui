import React, { Component } from "react";
import { DKLabel, INPUT_VIEW_DIRECTION } from "deskera-ui-library";
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
        ? "row justify-content-between align-items-start position-relative "
        : "column parent-width ";
    return (
      <div className={`${dirClassName} ${this.props.className}`}>
        {this.props.name && this.getIconTitle()}
        {this.getValueSection()}
      </div>
    );
  }

  getIconTitle() {
    return (
      <div className="mr-l">
        <div className="row mt-r mb-s ">
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
        className={`parent-width  ${
          this.props.direction === INPUT_VIEW_DIRECTION.VERTICAL ? "mt-ss" : ""
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
                : `Enter a valid ${this.props.name.toLowerCase()}`
            }
            className="text-red mt-s ml-xs"
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
          "parent-width border-box bg-gray1 border-radius-s p-s position-relative " +
          (this.props.invalid ? " border-red" : "")
        }
        style={style.parentWrapper}
      >
        <div
          className={"position-absolute parent-width"}
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
            className={`position-absolute border-none app-font parent-width p-s border-box`}
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
