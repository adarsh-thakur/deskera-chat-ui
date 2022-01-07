import React, { useEffect, useRef, useState } from 'react';
import { DKLabel, INPUT_TYPE, INPUT_VIEW_DIRECTION, DKButton } from 'deskera-ui-library';
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
    const scrollToBottom = () => {
        messageBottomRef.current && messageBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    const validateEmail = () => {
        const validEmail = isValidEmail(email);
        setEmailValid(validEmail);
        if (!validEmail) {
            return;
        }
    }

    const signUpUser = (skip = false) => {
        if (!skip) {
            validateEmail();
        }
        props.onSignUp(!skip ? email : undefined);
    }

    const createObserver = () => {
        const options = {
            root: document.querySelector('#chat-wrapper'),
            rootMargin: '1px',
            threshold: 1,
        }
        const observer = new IntersectionObserver((entries, observer) => {
            const entry = entries[0];
            if (entry.target === messageTopRef.current && entry.isIntersecting) {
                console.log('intersecting top');
            } else if (entry.target === messageBottomRef.current && entry.isIntersecting) {
                console.log('intersecting bottom');
            }
        }, options);
        if (messageTopRef.current) {
            observer.observe(messageTopRef.current);
        }
        if (messageBottomRef.current) {
            observer.observe(messageBottomRef.current);
        }
    }
    /* effects goes here */
    useEffect(() => {
        scrollToBottom();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [props.messages]);

    useEffect(() => {
        createObserver();
        setEmail('');
    }, [props.showChat]);

    useEffect(() => {
        setShowPopup(!props.hidePopup);
    }, [props.hidePopup]);

    /* helper renderer goes here */
    const renderHeader = () => {
        return <div className="row p-v-l p-h-s"
            style={{
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                backgroundColor: props.accentColor ? props.accentColor : '#1c73e8',
            }}>
            <DKLabel
                className="text-white fw-b fs-m"
                text={'Hey there 👋🏻'}
            />
        </div>;
    }

    const renderChatHistory = () => {
        return <div
            id="chat-wrapper"
            className={`display-flex column parent-width border-box scroll-y-only-web hide-scroll-bar`}
            style={{
                overflowX: 'auto'
            }}
        >
            {props.showChat && <div className="dk-chat-screen parent-size border-radius-m parent-width" style={{ height: '98%' }}>
                <div ref={messageTopRef} id="message-top-ref" className='parent-width'></div>
                {props.messages?.map((message, index) => {
                    const updatedMessage = { ...message, sender: message.from?.id == props.cookies?.id };
                    return (
                        <ChatBubble
                            currentUserId={props.userId}
                            accentColor={props.accentColor}
                            avatar={props.avatar}
                            data={updatedMessage}
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
                        backgroundColor: props.accentColor ? props.accentColor : '#1c73e8',
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
            accentColor={props.accentColor}
            onSend={props.onSendMessage}
            currentThreadId={props.cookies?.threadId}
            onAttachment={props.onAttachmentAdd}
        />
    }

    const renderPopup = () => {
        return (
            <div
                className="column position-absolute justify-content-between shadow-m border-radius-m bg-white"
                style={{
                    opacity: showPopup ? 1 : 0,
                    visibility: showPopup ? 'visible' : 'hidden',
                    width: 350,
                    height: '80vh',
                    bottom: 80,
                    right: 20,
                    transition: 'visibility 0s, opacity 0.5s ease-in',
                }}
            >
                {renderHeader()}
                {renderChatHistory()}
                <div className="parent-width">
                    {!props.showChat && renderEmailInput()}
                    {props.showChat && renderChatInput()}
                </div>
            </div>
        );
    }

    /* Main renderer goes here */
    return (
        <>
            {renderPopup()}
        </>
    )
}
