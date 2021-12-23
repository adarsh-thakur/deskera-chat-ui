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
import {
	getFormattedTimeFromDate,
	highlightString,
	isEmptyObject,
	triggerDownload,
} from '../Utility/Utility';
import { FILE_TYPE } from '../Utility/Enum';

export interface IChatBubbleProps {
	messages?: any[];
	searchText?: String;
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
	componentDidMount() {}
	componentWillReceiveProps(nextProps) {}
	render() {
		return (
			<div
				className="row display-flex parent-width"
				style={{ flexDirection: 'column' }}
			>
				{this.state.showImagePopup && this.imagePopup()}
				<>
					<div
						className={`justify-content-start align-items-end ${
							!this.props.data.sender ? 'row' : 'row-reverse'
						}`}
					>
						<DKContactIcon
							title={`${!this.props.data.sender ? 'R' : 'S'}`}
							className={`flex-shrink-0 border-m display-only-web bg-gray3 ${
								!this.props.data.sender ? 'ml-s' : 'mr-s'
							}`}
						/>
						<div
							className={`m-v-s p-s fs-m position-relative ${
								!this.props.data.sender
									? 'ml-m chat-bubble-receiver'
									: 'mr-m text-white chat-bubble-sender'
							}`}
							style={{
								backgroundColor: !this.props.data.sender
									? '#dcdcdc'
									: '#1c73e8',
								display: 'inline',
								maxWidth: '35%',
								minWidth: '15%',
							}}
						>
							{this.props.data.sender &&
								this.props.data.updatedBy ==
									'UserManager.getUserIamID()' && (
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
							{this.getDisplayContent()}
							<div
								className={`position-absolute`}
								style={{
									bottom: 4,
									fontSize: '11px',
									right: '10px',
								}}
							>
								{getFormattedTimeFromDate(
									new Date(this.props.data?.sentAt)
								)}
							</div>
						</div>
					</div>
				</>
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
						className="fs-r text-align-left mb-m"
					/>
				);
			case MESSAGE_TYPE.MULTIMEDIA:
				return (
					<div className="document-container">
						<div className="display-flex mb-m justify-content-center position-relative p-m">
							{this.getFilePlaceholder(
								body.attachments[0].url
							)}
						</div>
					</div>
				);
			default:
				return (
					<div
						className="display-flex mb-m"
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
					className="display-flex mb-m cursor-hand"
					style={{
						maxWidth: 230,
					}}
					onClick={() => this.showImage(fileLink)}
				>
					<img
						src={fileLink}
						className="parent-width"
						alt="chat-image"
					/>
				</div>
			);
		} else {
			return (
				<DKIcon
					src={this.getFileIconByFileType(fileType)}
					className="ic-m unselectable cursor-hand border-radius-m"
				/>
			);
		}
	};
	getFileIconByFileType = (type) => {
		switch (type) {
			case FILE_TYPE.PDF:
				return require('../assests/svgs/pdf.svg').default as string;
			case FILE_TYPE.EXCEL:
				return require('../assests/svgs/excel.svg').default as string;
			case FILE_TYPE.POWERPOINT:
				return require('../assests/svgs/powerpoint.svg').default as string;
			default:
				return require('../assests/svgs/word.svg').default as string;
		}
	}
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
