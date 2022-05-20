import React, { useEffect, useRef, useState } from 'react';
import { DKLabel, INPUT_TYPE, INPUT_VIEW_DIRECTION, DKButton, DKIcon, DKIcons } from 'deskera-ui-library';
import ControlledInput from '../components/ControlledInput';
import ChatInputBox from './ChatInput';
import { isValidEmail } from '../Utility/Utility';
import ChatBubble from './ChatBubble';

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
        return <div className="row p-v-l p-h-s parent-width d-flex justify-content-between"
            style={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: props?.settings?.bubbleColor ? props?.settings?.bubbleColor : '#1c73e8',
            }}>
            <div className='d-flex align-items-center'>
            {props.settings?.profilePicUrl &&
                <img
                    src={props.settings?.profilePicUrl}
                    alt={props.settings.name}
                    className='border-radius-l mr-s'
                    style={{ width: 25 }} />
            }
            <DKLabel
                className="text-white fs-l"
                text={props.settings ? `Chat with <b>${props.settings.name} </b>` : '<b>Hey there 👋🏻 </b>'}
            />
            </div>
            <div className='pr-s'>
                <DKIcon src={DKIcons.white.ic_add}
                    onClick={() => { props?.onPopupClose?.(); }}
                    className="ic-r cursor-hand"
                    style={{
                    transform: `rotate(138deg)`,
                }}/>
            </div>
        </div>;
    }

    const renderChatHistory = () => {
        return <div
            id="chat-feed-wrapper"
            className={`display-flex column parent-size border-box scroll-y-only-web hide-scroll-bar`}
            style={{
                overflowX: 'auto'
            }}
            ref={props?.chatFeedWrapperRef}
        >
            {props.showChat && <div className="dk-chat-screen parent-size border-radius-m pt-m" style={{ height: '98%' }}>
                <div ref={messageTopRef} id="message-top-ref" className='parent-width'></div>
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
                <div ref={messageBottomRef} id="message-bottom-ref" className='parent-width' />
            </div>}
        </div>
    }

    const renderEmailInput = () => {
        return <>
            <ControlledInput
                className="p-h-s"
                value={email}
                placeHolder="Enter your email or skip to chat"
                type={INPUT_TYPE.EMAIL}
                direction={INPUT_VIEW_DIRECTION.VERTICAL}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={() => { }}
                invalid={!isEmailValid}
                autoFocus
            />
            <div className="row p-h-s pb-s">
                <DKButton
                    title="Submit"
                    className="fs-m border-m text-white mt-m"
                    style={{
                        backgroundColor: props?.settings?.bubbleColor,
                    }}
                    onClick={() => signUpUser()}
                />
                <DKButton
                    title="Skip"
                    className="fs-m border-m bg-gray1 mt-m ml-s"
                    onClick={() => signUpUser(true)}
                />
            </div>
        </>
    }

    const renderChatInput = () => {
        return <ChatInputBox
            className='p-s'
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
            <div className="parent-width">
                {!props.showChat && renderEmailInput()}
                {props.showChat && !props.currentThread?.closed && renderChatInput()}
                {props.showChat && props.currentThread?.closed && <div className="row p-l bg-deskera-secondary align-items-center">
                    <DKIcon src={DKIcons.ic_warning} className="ic-r mr-r" />
                    <div>Looks like this chat is no longer available.&nbsp;
                        <span
                            className='text-blue cursor-hand text-underline'
                            onClick={(e) => onNewChat(e)}
                        >Click Here</span> to start new chat.</div>
                </div>}
            </div>
        </>
    )
}
