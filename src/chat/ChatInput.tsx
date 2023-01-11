import React, { Component, RefObject } from 'react';
import { DKIcon, DKIcons, showAlert } from '../components/common';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import {MAX_FILE_SIZE, MESSAGE_TYPE } from '../Utility/Constants';
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
            <div className={`dk-chat-input-wrapper dk-chat-column dk-chat-parent-width ${this.props.className}`}>
            <div className="dk-chat-row dk-chat-parent-width dk-chat-border-m dk-chat-border-radius-m dk-chat-align-items-center">
                <div
                    placeholder="Type your message here"
                    style={{
                        maxHeight: 60,
                        minHeight: 50,
                        overflow: 'auto',
                        minWidth: '75%',
                        alignItems: 'flex-start',
                        wordBreak: 'break-word'
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
                    className={`dk-chat-row dk-chat-input dk-chat-fs-m dk-chat-p-s dk-chat-align-items-start dk-chat-pre-wrap dk-chat-display-flex dk-chat-hide-scroll-bar`}
                    onPaste={(e) => {
                        e.preventDefault();
                        const text = e.clipboardData.getData('text/plain');
                        document.execCommand('insertHTML', false, text);
                    }}
                    onKeyDown={this.onKeyDown}
                ></div>
                <div className="dk-chat-row dk-chat-justify-content-end dk-chat-p-v-xs dk-chat-p-h-s">
                    {this.state.showEmojiPicker && (
                        <div
                            className="dk-chat-position-absolute"
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
                        className="dk-chat-mr-s dk-chat-fs-xl dk-chat-unselectable dk-chat-cursor-hand dk-chat-emoji-button"
                    >
                        😀
                    </div>
                    <DKIcon
                        src={DKIcons.ic_add}
                        className="dk-chat-ic-s dk-chat-cursor-hand dk-chat-p-s dk-chat-border-radius-m"
                        onClick={() => {
                            this.openDocumentPicker();
                        }}
                    />
                    {this.getDocumentPicker()}
                </div>
                </div>
                <div className="dk-chat-fs-s dk-chat-row dk-chat-justify-content-center dk-chat-p-s dk-chat-text-gray">Powered by <a target="_blank" href="https://www.deskera.com" className="link fw-b dk-chat-text-gray" style={{ marginLeft:2,textDecoration:'none' }}> Deskera</a></div>
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
                            if (file.size > MAX_FILE_SIZE) {
                                showAlert('Limit Exceed', 'File size should be less than 5MB');
                                return;
                            }
                            formData.append('attachment', file);
                        }
                        this.props.onAttachment(formData);
                        e.target.value = null;
                    }
                }}
            />
        );
    };

    initializeImageSelect = () => {
        document.body.onfocus = this.checkIt;
    };

    checkIt = () => {
        if (document.querySelector('#inputDocument')) {
            const fileElement = document.querySelector(
                '#inputDocument'
                ) as HTMLInputElement;
        }
    };
}
