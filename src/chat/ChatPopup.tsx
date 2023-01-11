import React, { useEffect, useRef, useState } from 'react';
import { DKLabel,DKButton, DKIcon, DKIcons } from '../components/common';
import ControlledInput from '../components/ControlledInput';
import ChatInputBox from './ChatInput';
import { isValidEmail } from '../Utility/Utility';
import ChatBubble from './ChatBubble';
import { INPUT_TYPE, INPUT_VIEW_DIRECTION } from '../Utility/Enum';
import BookAMeet from '../components/book-meet';
import { IBDRPayload } from '../model/MeetModel';
import BDRInfo from './BDRInfo';

export default function ChatPopup(props: any) {
    /* state definitions goes here*/
    const [showPopup, setShowPopup] = useState(false);
    const [isEmailValid, setEmailValid] = useState(true);
    const [email, setEmail] = useState('');
    const messageTopRef: any = useRef();
    const messageBottomRef: any = useRef();

    /* business logic goes here */

    const validateEmail = () => {
        const validEmail = isValidEmail(email);
        setEmailValid(validEmail);
        if (!validEmail) {
            return;
        } else {
            props.onSignUp(email);
        }
    }
    const signUpUser = (skip = false) => {
        if (skip) {
            props.onSignUp();
        } else {
            validateEmail();
        }
    }

    const createObserver = () => {
        const options = {
            root: document.querySelector('#chat-feed-wrapper'),
            rootMargin: '1px',
            threshold: 1,
        }
        const observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.target === messageTopRef.current && entry.isIntersecting) {
                props?.reachedTop?.();
            } else if (entry.target === messageBottomRef.current && entry.isIntersecting) {
                props?.reachedBottom?.();
            }
        }, options);
        if (messageTopRef.current) {
            observer.observe(messageTopRef.current);
        }
        if (messageBottomRef.current) {
            observer.observe(messageBottomRef.current);
        }
    }
    const onNewChat = (e) => {
        e.preventDefault();
        props.startNewChat?.(e);
    }
    /* effects goes here */
    useEffect(() => {
        setTimeout(() => createObserver(), 1000);
        setEmail('');
    }, [props.showChat]);

    useEffect(() => {
        setShowPopup(!props.hidePopup);
    }, [props.hidePopup]);

    /* helper renderer goes here */
    const renderHeader = () => {
        return <div className="dk-chat-row dk-chat-p-v-l dk-chat-p-h-s dk-chat-parent-width dk-chat-d-flex dk-chat-justify-content-between"
            style={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: props?.settings?.bubbleColor ? props?.settings?.bubbleColor : '#1c73e8',
            }}>
            <div className='dk-chat-d-flex dk-chat-align-items-center'>
            {props.settings?.profilePicUrl &&
                <img
                    src={props.settings?.profilePicUrl}
                    alt={props.settings.name}
                    className='dk-chat-border-radius-l dk-chat-mr-s'
                    style={{ width: 25 }} />
            }
            <DKLabel
                className="dk-chat-text-white dk-chat-fs-l"
                text={props?.settings?.name ? `Chat with <b>${props.settings.name} </b>` : '<b>Hey there 👋🏻 </b>'}
            />
            </div>
            <div className='dk-chat-pr-s'>
                <DKIcon src={DKIcons.ic_add_white}
                    onClick={() => { props?.onPopupClose?.(); }}
                    className="dk-chat-ic-r dk-chat-cursor-hand"
                    style={{
                    transform: `rotate(138deg)`,
                }}/>
            </div>
        </div>;
    }

    const renderChatHistory = () => {
        return <div
            id="chat-feed-wrapper"
            className={`dk-chat-display-flex dk-chat-column dk-chat-parent-size dk-chat-border-box dk-chat-scroll-y-only-web dk-chat-hide-scroll-bar`}
            style={{
                overflowX: 'auto',
                padding:10
            }}
            ref={props?.chatFeedWrapperRef}
        >
            {props.bdrInfo && <BDRInfo
                bdrInfo={props.bdrInfo}
                onItemClick={(item) => {
                    props.onBDRItemClicked(item)
                }}
            />}
            {props.showChat && <div className="dk-chat-screen dk-chat-parent-size dk-chat-border-radius-m dk-chat-pt-m" style={{ height: '98%' }}>
                <div ref={messageTopRef} id="message-top-ref" className='dk-chat-parent-width'></div>
                {props.messages?.map((message, index) => {
                    return (
                        <ChatBubble
                            currentUserId={props.userId}
                            accentColor={props?.settings?.bubbleColor}
                            avatar={props.avatar}
                            data={message}
                            onActionButtonClick={(messageId, threadId, attachemntId) => { }}
                        />
                    );
                })}
                <BookAMeet
                    tenantId={props.tenantId}
                    invitee={{
                        name: "Pranshu Guest",
                        email: "pranshu@getnada.com",
                        phone: "+9144656345467",
                        profilePic: null
                    }}
                    host={{
                        userId: props.bdrInfo.iamUserId,
                        name: props.bdrInfo.displayName,
                        email: props.bdrInfo.email,
                        phone: props.bdrInfo.phone,
                        profilePic: props.bdrInfo.profilePic,
                        meetLink: props.bdrInfo.meetingLink
                    }}
                    slot={localStorage.getItem("meetSlot") || null}
                    // onBookMeeting={props.onSendMessage}
                    onBookMeeting={(meetStartDate) => localStorage.setItem("meetSlot", meetStartDate)}
                />
                <div ref={messageBottomRef} id="message-bottom-ref" className='dk-chat-parent-width' />
            </div>}
        </div>
    }

    const renderEmailInput = () => {
        return <>
            <ControlledInput
                className="dk-chat-p-h-s"
                value={email}
                placeHolder="Enter your email or skip to chat"
                type={INPUT_TYPE.EMAIL}
                direction={INPUT_VIEW_DIRECTION.VERTICAL}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={() => { }}
                invalid={!isEmailValid}
                autoFocus
            />
            <div className="dk-chat-row dk-chat-p-h-s dk-chat-pb-s">
                <DKButton
                    title="Submit"
                    className="dk-chat-fs-m dk-chat-border-m dk-chat-text-white dk-chat-mt-m"
                    style={{
                        backgroundColor: props?.settings?.bubbleColor,
                    }}
                    onClick={() => signUpUser()}
                />
                <DKButton
                    title="Skip"
                    className="dk-chat-fs-m dk-chat-border-m dk-chat-bg-gray1 dk-chat-mt-m dk-chat-ml-s"
                    onClick={() => signUpUser(true)}
                />
            </div>
        </>
    }

    const renderChatInput = () => {
        return <ChatInputBox
            className='dk-chat-p-s'
            guest={true}
            accentColor={props?.settings?.bubbleColor}
            onSend={props.onSendMessage}
            currentThreadId={props?.currentThread?._id}
            onAttachment={props.onAttachmentAdd}
        />
    }

    /* Main renderer goes here */
    return (
        <>
            {renderHeader()}
            {renderChatHistory()}
            <div className="dk-chat-parent-width">
                {!props.showChat && !props.bdrInfo && renderEmailInput()}
                {props.showChat && !props.currentThread?.closed && !props.bdrInfo && renderChatInput()}
                {props.showChat && props.currentThread?.closed && <div className="dk-chat-row dk-chat-p-l dk-chat-bg-deskera-secondary dk-chat-align-items-center">
                    <DKIcon src={DKIcons.ic_warning} className="dk-chat-ic-r dk-chat-mr-r" />
                    <div>Looks like this chat is no longer available.&nbsp;
                        <span
                            className='dk-chat-text-blue dk-chat-cursor-hand dk-chat-text-underline'
                            onClick={(e) => onNewChat(e)}
                        >Click Here</span> to start new chat.</div>
                </div>}
            </div>
        </>
    )
}
