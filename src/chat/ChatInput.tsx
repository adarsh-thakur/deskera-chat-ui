import React, { Component, RefObject } from 'react';
import { DKButton, DKIcon, DKIcons } from 'deskera-ui-library';
// import Utility from '../../utility/Utility';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { MESSAGE_TYPE } from '../Utility/Constants';

export interface IChatInputBoxProps {
    onSend: (data, msgType?) => void;
    currentThread?: any;
    currentThreadId?: any;
    guest?: boolean;
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
            <div className={`dk-chat-input-wrapper column parent-width`}>
                <div className="column parent-width border-m border-radius-m">
                    <div
                        placeholder="Type your message here"
                        style={{
                            maxHeight: 60,
                            minHeight: 50,
                            overflow: 'auto',
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
                        className={`row dk-chat-input p-s align-items-start`}
                        onPaste={(e) => {
                            e.preventDefault();
                            const text = e.clipboardData.getData('text/plain');
                            document.execCommand('insertHTML', false, text);
                        }}
                        onKeyDown={this.onKeyDown}
                    ></div>
                    <div className="row justify-content-between p-v-xs p-h-s">
                        {this.state.showEmojiPicker && (
                            <div
                                className="position-absolute"
                                style={{
                                    bottom: 110,
                                    right:50
                                }}
                            >
                                <Picker
                                    showSkinTones={false}
                                    onSelect={this.onEmojiSelect}
                                />
                            </div>
                        )}
                        <div className="row">
                            <div
                                onClick={this.hideShowEmojiPicker}
                                className="mr-s fs-xxl unselectable cursor-hand emoji-button"
                            >
                                😀
                            </div>
                            <DKIcon
                                src={DKIcons.ic_attachment}
                                className="unselectable cursor-hand p-s border-radius-m"
                                onClick={() => {
                                    this.openDocumentPicker();
                                }}
                                style={{ height: '15px' }}
                            />
                            {this.getDocumentPicker()}
                            <DKIcon
                                src={DKIcons.ic_white_open}
                                className="unselectable cursor-hand p-s border-radius-m"
                                onClick={() => {
                                    this.openImagePicker();
                                }}
                                style={{ height: '15px' }}
                            />
                            {this.getImagePicker()}
                        </div>
                        <DKButton
                            title="Send"
                            className="fs-m dk-chat-input-send-btn bg-blue text-white p-h-l ml-s"
                            style={{ height: '36px' }}
                            onClick={this.onSend}
                        />
                    </div>
                </div>
            </div>
        );
    }
    onInput = (e) => {
        this.setState({
            showPlaceholder: this.messageBox.current.textContent,
        });
    };
    onSend = () => {
        if (this.messageBox?.current?.textContent) return;
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

    openImagePicker = () => {
        this.imagePickerExists = true;
        this.inputOpenFileRef.current.click();
    };

    openDocumentPicker = () => {
        this.documentPickerExists = true;
        this.documentInputOpenFileRef.current.click();
    };

    getImagePicker = () => {
        return (
            <input
                id="inputImage"
                type="file"
                accept="image/*"
                ref={this.inputOpenFileRef}
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
                        this.uploadImageToAWS(formData);
                    }
                }}
            />
        );
    };

    getDocumentPicker = () => {
        return (
            <input
                id="inputDocument"
                type="file"
                accept="application/pdf, .txt, .doc, .xls , .ppt, .docx, .xlsx, .pptx"
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
                        this.uploadImageToAWS(formData);
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
    uploadImageToAWS(imageData) {
        // let threadId = this.props.currentThread?._id
        //     ? this.props.currentThread?._id
        //     : this.props.currentThreadId;
        // let guest = this.props.guest;
        // this.messageBox.current.innerHTML = `<img src=${DKIcons.ic_document} height=40 />`;
        // Chat.uploadAttachment(imageData, threadId, guest).then(
        //     (response: any) => {
        //         this.setState({ attachmentIds: response.attachmentIds }, () => {
        //             this.imagePickerExists = false;
        //             this.documentPickerExists = false;
        //         });
        //     }
        // );
    }
}
