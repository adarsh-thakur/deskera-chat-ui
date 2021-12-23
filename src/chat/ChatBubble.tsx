import React, { Component, RefObject } from 'react';
import {
	DKIcons,
	DKIcon,
	DKContactIcon,
	DKLabel,
	DKButton,
	DKListPicker,
	DKSpinner,
} from 'deskera-ui-library';
import { MESSAGE_TYPE } from '../Utility/Constants';
import { getFormattedTimeFromDate, highlightString, isEmptyObject, triggerDownload } from '../Utility/Utility';

export interface IChatBubbleProps {
	messages?: any[];
	searchText: String;
	data: any;
	currentUserId: any;
	currentTenantId?: any;
	onActionButtonClick?: (messageId, threadId, attachmentId) => void;
}
export default class ChatBubble extends Component<IChatBubbleProps, any> {
	messagesEndRef: RefObject<any>;
	constructor(props) {
		super(props);
		this.state = {
			showImagePopup: false,
			messages: this.props.messages,
			showActionList: false,
		};
		this.messagesEndRef = React.createRef();
	}
	componentDidMount() {
		this.scrollToBottom();
		if (this.props.data.type === 'multimedia') {
			this.getAttachment(this.props.data.body.attachments[0]);
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ messages: nextProps.messages });
	}

	scrollToBottom = () => {
		this.messagesEndRef.current &&
			this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
	};
	render() {
		let isReceiver =
			this.props.data.from?.id !=
			(this.props.currentUserId != null
				? this.props.currentUserId
				: 'UserManager.getUserIamID()') &&
			this.props.data.from?.id !=
			(this.props.currentTenantId != null
				? this.props.currentTenantId
				: 'UserManager.getUserTenantID()');
		return (
			<div
				className="row display-flex parent-width"
				style={{ flexDirection: 'column' }}
			>
				{this.state.showImagePopup && this.imagePopup()}
				<>
					<div
						className={`justify-content-start align-items-end ${isReceiver ? 'row' : 'row-reverse'
							}`}
					>
						<DKContactIcon
							title={`${isReceiver ? 'R' : 'S'}`}
							className={`flex-shrink-0 border-m display-only-web bg-gray3 ${isReceiver ? 'ml-s' : 'mr-s'
								}`}
						/>
						<div
							className={`m-v-s p-s fs-m position-relative ${isReceiver
								? 'ml-m chat-bubble-receiver'
								: 'mr-m text-white chat-bubble-sender'
								}`}
							style={{
								backgroundColor: isReceiver ? '#dcdcdc' : '#1c73e8',
								display: 'inline',
								maxWidth: '35%',
								minWidth: '15%',
							}}
						>
							{!isReceiver && this.props.data.updatedBy == 'UserManager.getUserIamID()' && (
								<div
									className="p-s"
									onClick={() =>
										this.setState({
											showActionList:
												!this.state.showActionList,
										})
									}
								>
									<DKIcon
										className="bubble-arrow position-absolute"
										style={{
											height: 14,
											top: 5,
											right: 8,
											opacity: 0.5,
										}}
										src={DKIcons.ic_arrow_down2}
									/>
								</div>
							)}
							{this.state.showActionList &&
								this.getActionListPicker(
									this.props.data._id,
									this.props.data.threadId,
									this.props.data.body?.attachments[0]
								)}
							{this.getDisplayContent(
								this.props.data.type,
								this.props.data.body.text,
								this.state.link
							)}
							<div
								className={`position-absolute`}
								style={{
									bottom: 4,
									fontSize: '11px',
									right: '10px',
								}}
							>
								{getFormattedTimeFromDate(new Date(this.props.data?.sentAt))}
							</div>
						</div>
					</div>
					<div ref={this.messagesEndRef} />
				</>
			</div>
		);
	}
	showHideActionList = () => {
		this.setState({
			showActionList: !this.state.showActionList,
		});
	};
	displayFileIconByType(file) {
		const imageExtensions = ['png', 'jpeg', 'jpg', 'jpeg', 'svg', 'bmp'];
		const documentFileExtensions = ['doc', 'docx'];
		const pdfFileExtensions = ['pdf'];
		const pptFileExtensions = ['ppt', 'pptx'];
		const xlsFileExtensions = ['xls', 'xlsx', 'csv'];
		const ext = file.substr(file.lastIndexOf('.') + 1);
		if (imageExtensions.includes(ext)) {
			return 'img';
		} else if (pdfFileExtensions.includes(ext)) {
			return 'pdf';
		} else if (documentFileExtensions.includes(ext)) {
			return 'doc';
		} else if (xlsFileExtensions.includes(ext)) {
			return 'excel';
		} else if (pptFileExtensions.includes(ext)) {
			return 'powerpoint';
		} else {
			return 'file';
		}
	}

	findSearchContent = (messageText) => {
		let searchText = this.props.searchText;
		if (isEmptyObject(searchText)) {
			return messageText;
		} else {
			if (messageText.toLowerCase().includes(searchText.toLowerCase())) {
				return highlightString(messageText, searchText);
			}
			return messageText;
		}
	};
	getAttachment = (attachment) => {
		// Chat.getAttachment(attachment, this.props.data?.threadId).then(
		// 	(response: any) => {
		// 		this.setState({
		// 			link: response?.downloadLink
		// 				? response?.downloadLink
		// 				: null,
		// 		});
		// 	}
		// );
	};
	getDisplayContent = (type, content, attachment) => {
		let isAttachmentPreset =
			attachment != undefined && this.displayFileIconByType(attachment);
		switch (type) {
			case MESSAGE_TYPE.TEXT:
				return (
					<DKLabel
						text={this.findSearchContent(content)}
						className="fs-r text-align-left mb-m"
					/>
				);
			case MESSAGE_TYPE.MULTIMEDIA:
				return (
					<div className="document-container">
						<div
							className="display-flex mb-m justify-content-center position-relative p-m"
						>
							{isAttachmentPreset === 'img' && (
								<div
									className="display-flex mb-m cursor-hand"
									style={{
										maxWidth: 230,
									}}
									onClick={() => this.showImage(attachment)}
								>
									<img
										src={attachment}
										className="parent-width"
										alt="chat-image"
									/>
								</div>
							)}
							{attachment == undefined && (
								<DKSpinner
									iconClassName="ic-s-2"
									className="ml-m"
								/>
							)}
							{isAttachmentPreset === 'pdf' && (
								<DKIcon
									src={require("../assests/svgs/pdf.svg") as string}
									className="ic-m unselectable cursor-hand border-radius-m"
								/>
							)}
							{isAttachmentPreset === 'doc' && (
								<DKIcon
									src={require("../assests/svgs/word.svg") as string}
									className="ic-m unselectable cursor-hand border-radius-m"
								/>
							)}
							{isAttachmentPreset === 'excel' && (
								<DKIcon
									src={require("../assests/svgs/excel.svg") as string}
									className="ic-m unselectable cursor-hand border-radius-m"
								/>
							)}
							{isAttachmentPreset === 'powerpoint' && (
								<DKIcon
									src={require("../assests/svgs/powerpoint.svg") as string}
									className="ic-m unselectable cursor-hand border-radius-m"
								/>
							)}
							{isAttachmentPreset === 'file' && (
								<DKIcon
									src={DKIcons.ic_document}
									className="ic-m unselectable cursor-hand border-radius-m"
								/>
							)}
						</div>
						{isAttachmentPreset != 'img' && (
							<div className="mb-m justify-content-center border-radius-m position-absolute transparent-background display-none download-button">
								<DKIcon
									src={DKIcons.white.ic_download}
									className="ic-l unselectable cursor-hand border-radius-m d-flex align-self-center"
									style={{
										width: 22,
									}}
									onClick={() =>
										this.downloadDocument(attachment)
									}
								/>
							</div>
						)}
					</div>
				);
			default:
				return (
					<div
						className="display-flex mb-m"
						dangerouslySetInnerHTML={{
							__html: content,
						}}
						style={{
							fontSize: '12px',
							textAlign: 'left',
						}}
					></div>
				);
		}
	};
	showImage = (image = null) => {
		this.setState({ showImagePopup: !this.state.showImagePopup, image });
	};
	imagePopup = () => {
		return (
			<div className="transparent-background">
				<div className="popup-window">
					<div className="row" style={{ justifyContent: 'flex-end' }}>
						<DKButton
							icon={DKIcons.ic_close}
							onClick={() => this.showImage()}
						/>
					</div>
					<div className="row justify-content-between flex-wrap">
						<img
							src={this.state.image}
							className="parent-width"
							alt="chat-image"
						/>
					</div>
				</div>
			</div>
		);
	};
	downloadDocument(dataUrl) {
		let fileName = dataUrl.split('/').pop();
		var req = new XMLHttpRequest();
		req.open('GET', dataUrl, true);
		req.responseType = 'blob';
		req.onload = function () {
			var blob = new Blob([req.response], {
				type: 'application/octetstream',
			});
			triggerDownload(blob, fileName);
		};
		req.send();
	}
	getActionListPicker(messageId, threadId, attachmentId) {
		return (
			<DKListPicker
				data={['Delete message']}
				className="position-absolute border-m shadow-m z-index-3 text-gray"
				style={{ top: 15, width: 130, right: 0 }}
				onSelect={(index, value) => {
					this.props.onActionButtonClick(
						messageId,
						threadId,
						attachmentId
					);
					this.setState({ showActionList: false });
				}}
				onClose={() => this.setState({ showActionList: false })}
			/>
		);
	}
}
