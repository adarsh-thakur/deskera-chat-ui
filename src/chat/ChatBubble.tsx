import React, { Component } from 'react';
import {
	DKIcons,
	DKIcon,
	DKContactIcon,
	DKLabel,
	DKButton,
	DKListPicker,
} from '../components/common';
import { MESSAGE_TYPE } from '../Utility/Constants';
import {
	highlightString,
	isEmptyObject,
	triggerDownload,
	getFormattedTime
} from '../Utility/Utility';
import { FILE_TYPE } from '../Utility/Enum';

export interface IChatBubbleProps {
	currentUserId: string;
	messages?: any[];
	searchText?: String;
	accentColor?: string;
	avatar?: string;
	data: any;
	onActionButtonClick?: (messageId, threadId, attachmentId) => void;
}
export default class ChatBubble extends Component<IChatBubbleProps, any> {
	constructor(props) {
		super(props);
		this.state = {
			showImagePopup: false,
			showActionList: false,
		};
	}
	render() {
		let fileType;
		if (this.props.data.body?.attachments[0]) {
			fileType = this.getFileTypeByFile(this.props.data.body?.attachments[0]?.url);
		}

		return (
			<div
				className="dk-chat-row dk-chat-display-flex parent-width"
			>
				{this.state.showImagePopup && this.imagePopup()}
					<div
						className={`dk-chat-justify-content-start dk-chat-align-items-end ${
							!this.props.data.sender ? 'dk-chat-row' : 'dk-chat-row-reverse'
						}`}
				>
					<DKContactIcon
							title={`${!this.props.data.sender ? 'R' : 'S'}`}
							className={`dk-chat-flex-shrink-0 dk-chat-border-m dk-chat-display-only-web dk-chat-bg-gray1 ${
								!this.props.data.sender ? 'dk-chat-ml-s' : 'dk-chat-mr-s'
							}`}
						/>
						<div
							className={`dk-chat-mt-s dk-chat-p-s dk-chat-fs-m dk-chat-position-relative ${
								!this.props.data.sender
									? 'dk-chat-ml-m dk-chat-chat-bubble-receiver'
									: 'dk-chat-mr-m dk-chat-text-white dk-chat-chat-bubble-sender'
							}`}
							style={{
								backgroundColor:this.props.data.type == MESSAGE_TYPE.MULTIMEDIA && fileType === FILE_TYPE.IMAGE ? '': !this.props.data.sender ? '#dcdcdc' : this.props.accentColor ? this.props.accentColor : '#1c73e8',
								display: 'inline',
								maxWidth: '60%',
								minWidth: '20%',
							}}
						>
							{this.props.data.sender &&
								this.props.data.updatedBy == this.props.currentUserId && (
									<div
										onClick={() =>
											this.setState({
												showActionList:
													!this.state.showActionList,
											})
										}
									>
										<DKIcon
											className="dk-chat-bubble-arrow dk-chat-position-absolute"
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
							{this.getDisplayContent()}
							<div
								className={`position-absolute`}
								style={{
									bottom: 4,
									fontSize: 11,
									right: 10,
								}}
							>
								{getFormattedTime(
									new Date(this.props.data?.sentAt)
								)}
							</div>
						</div>
					</div>
			</div>
		);
	}
	showHideActionList = () => {
		this.setState({
			showActionList: !this.state.showActionList,
		});
	};
	getFileTypeByFile(file) {
		const imageExtensions = ['png', 'jpeg', 'jpg', 'jpeg', 'svg', 'bmp', 'gif'];
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
	getDisplayContent = () => {
		const { type, body } = this.props.data;
		switch (type) {
			case MESSAGE_TYPE.TEXT:
				return (
					<DKLabel
						text={this.findSearchContent(body.text)}
						className="dk-chat-fs-r dk-chat-text-align-left dk-chat-mb-m dk-chat-fs-m"
					/>
				);
			case MESSAGE_TYPE.MULTIMEDIA:
				return (
					<div className="dk-chat-document-container">
						<div className="dk-chat-display-flex dk-chat-mb-m dk-chat-justify-content-center dk-chat-position-relative dk-chat-p-m">
							{this.getFilePlaceholder(
								body.attachments[0].url
							)}
						</div>
					</div>
				);
			default:
				return (
					<div
						className="display-flex dk-chat-mb-m"
						dangerouslySetInnerHTML={{
							__html: body.text,
						}}
						style={{
							fontSize: '12px',
							textAlign: 'left',
						}}
					></div>
				);
		}
	};
	getFilePlaceholder = (fileLink) => {
		const fileType = this.getFileTypeByFile(fileLink);
		if (fileType === FILE_TYPE.IMAGE) {
			return (
				<div
					className="display-flex dk-chat-mb-m dk-chat-cursor-hand"
					style={{
						maxWidth: 230,
					}}
					onClick={() => this.showImage(fileLink)}
				>
					<img
						src={fileLink}
						className="dk-chat-parent-width"
						alt="chat-attachment"
					/>
				</div>
			);
		} else {
			return (
				<>
					<DKIcon
						src={this.getFileIconByFileType(fileType)}
						className="dk-chat-ic-m dk-chat-unselectable dk-chat-cursor-hand dk-chat-border-radius-m"
					/>
					<div className="dk-chat-mb-m dk-chat-justify-content-center dk-chat-border-radius-m dk-chat-position-absolute dk-chat-transparent-background dk-chat-display-none dk-chat-download-button">
						<DKIcon
							src={DKIcons.ic_download}
							className="dk-chat-ic-l dk-chat-unselectable dk-chat-cursor-hand dk-chat-border-radius-m dk-chat-d-flex dk-chat-align-self-center"
							style={{
								width: 22,
							}}
							onClick={() => this.openFileInNewWindow(fileLink)}
						/>
					</div>
				</>
			);
		}
	};
	getFileIconByFileType = (type) => {
		switch (type) {
			case FILE_TYPE.PDF:
				return 'http://crm-ui-dev.deskera.xyz/chat-ui/pdf.svg';
			case FILE_TYPE.EXCEL:
				return 'http://crm-ui-dev.deskera.xyz/chat-ui/excel.svg';
			case FILE_TYPE.POWERPOINT:
				return 'http://crm-ui-dev.deskera.xyz/chat-ui/powerpoint.svg';
			default:
				return 'http://crm-ui-dev.deskera.xyz/chat-ui/word.svg';
		}
	}
	showImage = (image = null) => {
		this.setState({ showImagePopup: !this.state.showImagePopup, image });
	};
	imagePopup = () => {
		return (
			<div className="dk-chat-transparent-background">
				<div className="dk-chat-popup-window">
					<div className="dk-chat-row" style={{ justifyContent: 'flex-end' }}>
						<DKButton
							icon={DKIcons.ic_add}
							onClick={() => this.showImage()}
							style={{
								transform:`rotate(138deg)`
							}}
						/>
					</div>
					<div className="dk-chat-row dk-chat-justify-content-between dk-chat-flex-wrap">
						<img
							src={this.state.image}
							className="dk-chat-parent-width"
							alt="chat-image"
						/>
					</div>
				</div>
			</div>
		);
	};
	openFileInNewWindow(dataUrl) {
		window.open(dataUrl, '_blank');
	}
	getActionListPicker(messageId, threadId, attachmentId) {
		return (
			<DKListPicker
				data={['Delete message']}
				className="dk-chat-position-absolute dk-chat-border-m dk-chat-shadow-m dk-chat-z-index-3 dk-chat-text-gray"
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
