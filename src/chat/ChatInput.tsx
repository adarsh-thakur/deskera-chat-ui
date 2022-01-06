import React, { Component, RefObject } from 'react';
import { DKButton, DKIcon, DKIcons } from 'deskera-ui-library';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { MESSAGE_TYPE } from '../Utility/Constants';

export interface IChatInputBoxProps {
    className?: string;
    onSend: (data, msgType?) => void;
    currentThread?: any;
    currentThreadId?: any;
	accentColor?: string;
    guest?: boolean;
    onAttachment?: (formData: FormData) => void;
}

export default class ChatInputBox extends Component<IChatInputBoxProps, any> {
    inputOpenFileRef: RefObject<any>;
    imagePickerExists = false;
    documentInputOpenFileRef: RefObject<any>;
    documentPickerExists = false;
    messageBox: RefObject<any>;
    fileUrl: any = [];
    fileType: RefObject<any>;
    docList: any = [];
    constructor(props) {
        super(props);
        this.state = {
            showPlaceholder: true,
            showEmojiPicker: false,
            attachmentIds: [],
        };
        this.messageBox = React.createRef();
        this.inputOpenFileRef = React.createRef();
        this.documentInputOpenFileRef = React.createRef();
        this.fileUrl = [];
        this.fileType = null;
    }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        return (
            <div className={`dk-chat-input-wrapper column parent-width ${this.props.className}`}>
            <div className="row parent-width border-m border-radius-m">
                <div
                    placeholder="Type your message here"
                    style={{
                        maxHeight: 60,
                        minHeight: 50,
                        overflow: 'auto',
                        minWidth: '75%'
                    }}
                    ref={this.messageBox}
                    contentEditable
                    role="textbox"
                    onInput={this.onInput}
                    onFocus={() =>
                        this.state.showEmojiPicker
                            ? this.hideShowEmojiPicker()
                            : null
                    }
                    dir="ltr"
                    className={`row dk-chat-input p-s align-items-start pre-wrap`}
                    onPaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text/plain');
                        document.execCommand('insertHTML', false, text);
                    }}
                    onKeyDown={this.onKeyDown}
                ></div>
                <div className="row justify-content-end p-v-xs p-h-s">
                    {this.state.showEmojiPicker && (
                        <div
                            className="position-absolute"
                            style={{
                                bottom: 110,
                                right: 50,
                            }}
                        >
                            <Picker
                                showSkinTones={false}
                                onSelect={this.onEmojiSelect}
                            />
                        </div>
                    )}
                    <div
                        onClick={this.hideShowEmojiPicker}
                        className="mr-s fs-xl unselectable cursor-hand emoji-button"
                    >
                        😀
                    </div>
                    <DKIcon
                        src={DKIcons.ic_add}
                        className="ic-s cursor-hand p-s border-radius-m"
                        onClick={() => {
                            this.openDocumentPicker();
                        }}
                    />
                    {this.getDocumentPicker()}
                </div>
                </div>
                <div className="fs-s row justify-content-center p-s">Powered by <a target="_blank" href="https://www.deskera.com" className="link fw-b" style={{color:'black',marginLeft:2,textDecoration:'none'}}> Deskera</a></div>
        </div>
		);
    }
    onInput = (e) => {
        this.setState({
            showPlaceholder: this.messageBox.current.textContent,
        });
    };
    onSend = () => {
        if (!this.messageBox?.current?.textContent) return;
        if (this.state.attachmentIds.length > 0) {
            this.props.onSend(
                this.state.attachmentIds,
                MESSAGE_TYPE.MULTIMEDIA
            );
            this.setState({ attachmentIds: [] });
        } else {
            this.props.onSend?.(
                this.messageBox?.current?.textContent,
                MESSAGE_TYPE.TEXT
            );
        }
        if (this.messageBox.current) {
            this.messageBox.current.textContent = null;
            this.messageBox.current.focus();
            this.onInput(null);
        }
    };
    hideShowEmojiPicker = () => {
        this.setState({ showEmojiPicker: !this.state.showEmojiPicker });
    };
    onEmojiSelect = (emoji) => {
        this.messageBox.current.textContent += emoji.native;
        this.onInput(null);
    };
    onKeyDown = (e: any) => {
        if (e.key === 'Escape' || e.keyCode === 27) {
            if (this.state.showEmojiPicker) this.hideShowEmojiPicker();
        } else if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                document.execCommand('insertLineBreak');
            } else {
                this.onSend();
            }
        }
    };

    openDocumentPicker = () => {
        this.documentPickerExists = true;
        this.documentInputOpenFileRef.current.click();
    };

    getDocumentPicker = () => {
        return (
            <input
                id="inputDocument"
                type="file"
                accept="application/pdf, .txt, .doc, .xls , .ppt, .docx, .xlsx, .pptx, image/*"
                ref={this.documentInputOpenFileRef}
                style={{ display: 'none' }}
                onClick={(e) => {
                    this.initializeImageSelect();
                    e.stopPropagation();
                }}
                onChange={(e) => {
                    let formData = new FormData();
                    if (e.target.files.length > 0) {
                        for (
                            let index = 0;
                            index < e.target.files.length;
                            ++index
                        ) {
                            let file = e.target.files.item(index);
                            formData.append('attachment', file);
                        }
                        this.props.onAttachment(formData);
                    }
                }}
            />
        );
    };

    initializeImageSelect = () => {
        document.body.onfocus = this.checkIt;
    };

    checkIt = () => {
        if (document.querySelector('#inputImage')) {
            const fileElement = document.querySelector(
                '#inputImage'
            ) as HTMLInputElement;
            if (fileElement.files && fileElement.files.length === 0) {
                this.imagePickerExists = false;
                // return;
            }
        }
        if (document.querySelector('#inputDocument')) {
            const fileElement = document.querySelector(
                '#inputDocument'
            ) as HTMLInputElement;
            if (fileElement.files && fileElement.files.length === 0) {
                this.documentPickerExists = false;
                // return;
            }
        }
    };
}
