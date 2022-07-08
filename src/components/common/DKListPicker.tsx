import React, { Component, createRef } from "react";
import DKContactIcon from "./DKContactIcon";
import DKLabel from "./DKLabel";
import DKButton from "./DKButton";
import DKIcon from "./DKIcon";
import { getCapitalized, isEmptyObject } from "../../Utility/Utility";
import { KEY_CODES } from "../../Utility/Enum";
import { DKIcons } from "./DkIcons";

export interface IDkListPickerProps {
    className?: string;
    width?: string;
    iconClassName?: string;
    style?: React.CSSProperties;
    title?: string;
    data?: string[];
    icons?: string[];
    onClose?: () => void;
    onSelect?: (index: number, value: string) => void;
    needIcon?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    onEdit?: (index: number, value: string) => void;
    onDelete?: (index: number, value: string) => void;
    button?: {
        title?: string;
        icon?: string;
        className?: string;
        style?: React.CSSProperties;
        onClick?: () => void;
    };
    allowSearch?: boolean;

}

export default class DKListPicker extends Component<IDkListPickerProps, any> {
    activeListItemRef: any = createRef();
    constructor(props) {
        super(props);
        this.state = {
            dataInit: this.props.data,
            data: this.props.data,
            activeListItem: null,
            textFieldValue: "",
        };
    }
    componentWillReceiveProps(nextProps) {
        if (
            !isEmptyObject(nextProps.data) &&
            nextProps.data.length !== 0 &&
            JSON.stringify(this.state.dataInit) !== JSON.stringify(nextProps.data)
        ) {
            this.setState({
                dataInit: nextProps.data,
                data: nextProps.data,
            });
        }
    }
    componentDidMount() {
        this.registerEventListeners();
    }
    componentDidUpdate() {
        this.activeListItemRef?.current?.scrollIntoView({
            block: "nearest",
            inline: "nearest",
            behavior: "smooth",
        });
    }
    componentWillUnmount() {
        this.deregisterEventListeners();
    }

    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ///////////////////////EVENT LISTENERS//////////////////////////
    registerEventListeners() {
        if (this.props.onClose) {
            document.addEventListener("mouseup", this.onMouseUp);
        }

        document.addEventListener("keydown", this.handleKeyPress);
    }
    deregisterEventListeners() {
        if (this.props.onClose) {
            document.removeEventListener("mouseup", this.onMouseUp);
        }

        document.removeEventListener("keydown", this.handleKeyPress);
    }
    onMouseUp = (e) => {
        if (this.props.onClose) {
            const target = e.target;
            const editingContainer = target.closest("#dk-list-picker");

            if (!editingContainer) {
                this.props.onClose();
            }
        }
    };
    handleListItemSelection = (counter = 0) => {
        const { activeListItem, data, dataInit } = this.state;

        let indexToSelect =
            ((isEmptyObject(activeListItem?.currentIndex)
                ? -counter
                : activeListItem?.currentIndex) +
                counter +
                data.length) %
            data.length;
        const obj = data[indexToSelect];

        const actualIndex = dataInit.indexOf(obj);

        this.setState((prevState) => ({
            activeListItem: {
                currentIndex: indexToSelect,
                actualIndex: actualIndex,
                obj: obj,
            },
        }));
    };
    handleKeyPress = (e) => {
        switch (e?.key) {
            case KEY_CODES.ESCAPE:
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                this.props.onClose && this.props.onClose();
                break;
            case KEY_CODES.ARROW_DOWN:
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                this.handleListItemSelection(1);
                break;
            case KEY_CODES.ARROW_UP:
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                this.handleListItemSelection(-1);
                break;
            case KEY_CODES.ENTER:
                e.preventDefault && e.preventDefault();
                e.stopPropagation && e.stopPropagation();
                const { activeListItem } = this.state;
                if (!isEmptyObject(activeListItem?.currentIndex)) {
                    this.props.onSelect(activeListItem.actualIndex, activeListItem.obj);
                }
                break;
            default:
        }
    };

    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    /////////////////////////RENDERERS////////////////////////////////
    render() {
        return (
            <div
                id="dk-list-picker"
                className={
                    "dk-chat-column dk-chat-shadow-ms dk-chat-border-radius-s dk-chat-pb-s " + this.props.className
                }
                style={{
                    ...{
                        backgroundColor: "white",
                        width: this.props.width ? this.props.width : null,
                    },
                    ...this.props.style,
                }}
            >
                <div className="dk-chat-parent-width ">
                    <div>
                        {this.props.title && (
                            <div className="dk-chat-row dk-chat-justify-content-between dk-chat-p-h-r dk-chat-pt-r ">
                                {this.props.title && (
                                    <DKLabel
                                        className="dk-chat-fw-m dk-chat-fs-r dk-chat-unselectable"
                                        text={this.props.title}
                                    />
                                )}
                            </div>
                        )}
                        {this.state.dataInit.length > 6 &&
                            this.props.allowSearch !== false &&
                            this.getTextField()}
                    </div>
                    <div
                        style={{
                            overflowY: "scroll",
                            maxHeight: 240,
                        }}
                        className="dk-chat-hide-scroll-bar dk-chat-mt-s"
                    >
                        {this.getList(this.state.data, this.props.needIcon)}
                    </div>
                    {this.props.button && this.getButton()}
                    {(this.state.data === null ||
                        this.state.data === undefined ||
                        this.state.data.length === 0) && (
                            <DKLabel
                                text="No data found"
                                className="dk-chat-text-align-center dk-chat-p-v-xl dk-chat-text-gray"
                            />
                        )}
                </div>
            </div>
        );
    }

    getButton() {
        const buttonData = this.props.button;
        return (
            <div className="dk-chat-p-r dk-chat-border-box">
                <DKButton
                    icon={buttonData.icon}
                    title={buttonData.title}
                    onClick={() => {
                        buttonData.onClick();
                    }}
                    className={"dk-chat-parent-width dk-chat-border-box " + buttonData.className}
                    style={buttonData.style}
                />
            </div>
        );
    }

    getList(list, needIcon) {
        let arr = [];
        for (let i = 0; i < list.length; i++) {
            arr.push(
                this.listItem(
                    list[i],
                    this.props.icons ? this.props.icons[i] : null,
                    i,
                    needIcon
                )
            );
        }
        return arr;
    }
    listItem(title, icon, listIndex, needIcon) {
        const { activeListItem } = this.state;

        return (
            <div
                className={`dk-chat-row dk-chat-listPickerBG dk-chat-cursor-hand dk-chat-p-h-r dk-chat-justify-content-between dk-chat-list-row ${activeListItem?.currentIndex === listIndex ? "-active-item" : ""
                    }`}
                ref={
                    activeListItem?.currentIndex === listIndex
                        ? this.activeListItemRef
                        : null
                }
            >
                <div
                    className="dk-chat-row dk-chat-p-v-s"
                    onClick={() => {
                        this.props.onSelect(this.state.dataInit.indexOf(title), title);
                    }}
                >
                    {icon && <DKIcon src={icon} className="dk-chat-ic-s dk-chat-mr-r" />}
                    {!icon && needIcon && (
                        <DKContactIcon className={this.props.iconClassName} title={title} />
                    )}
                    {needIcon && <div style={{ width: 8 }} />}
                    <DKLabel className="unselectable" text={getCapitalized(title)} />
                </div>
                {(this.props.canEdit || this.props.canDelete) && (
                    <div className="dk-chat-row dk-chat-option-actions dk-chat-width-auto">
                        {this.props.canEdit && (
                            <DKButton
                                icon={DKIcons.ic_edit}
                                style={{
                                    opacity: 0.6,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingRight: 0,
                                    paddingLeft: 2,
                                }}
                                onClick={() => {
                                    this.props.onEdit(this.state.dataInit.indexOf(title), title);
                                }}
                            />
                        )}
                        {this.props.canDelete && (
                            <DKButton
                                icon={DKIcons.ic_delete}
                                style={{
                                    opacity: 0.6,
                                    paddingTop: 0,
                                    paddingBottom: 0,
                                    paddingRight: 0,
                                    paddingLeft: 10,
                                }}
                                onClick={() => {
                                    this.props.onDelete(
                                        this.state.dataInit.indexOf(title),
                                        title
                                    );
                                }}
                            />
                        )}
                    </div>
                )}
            </div>
        );
    }

    getTextField() {
        return (
            <div
                className={
                    "dk-chat-parent-width dk-chat-border-box dk-chat-p-h-r dk-chat-app-font " +
                    (this.props.title ? "mt-r" : "mt-l")
                }
            >
                <input
                    autoFocus={true}
                    autoComplete="off"
                    spellCheck={false}
                    className="dk-chat-border-none dk-chat-bg-gray1 dk-chat-border-s dk-chat-p-h-s dk-chat-p-v-xs dk-chat-border-radius-s dk-chat-border-box dk-chat-parent-width"
                    style={{ outline: "none" }}
                    onChange={(e) => {
                        this.textChanged(e.target.value);
                    }}
                    placeholder="Search.."
                />
            </div>
        );
    }
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    textChanged = (value) => {
        this.setState({
            textFieldValue: value,
            activeListItem: null,
        });
        this.filterDataFor(value);
    };

    filterDataFor(value) {
        let mainData = this.state.dataInit;
        let filteredData = mainData.filter((obj) =>
            obj.toLowerCase().includes(value.toLowerCase())
        );
        this.setState({
            data: value === "" ? mainData : filteredData,
        });
    }
}
