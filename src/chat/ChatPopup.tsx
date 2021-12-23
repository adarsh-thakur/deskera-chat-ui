import React, { useEffect, useRef, useState } from 'react';
import { DKIcons, DKIcon, DKLabel, INPUT_TYPE, INPUT_VIEW_DIRECTION, DKButton } from 'deskera-ui-library';
import ControlledInput from '../components/ControlledInput';
import ChatInputBox from './ChatInput';
import { TenantService } from '../services/tenant';
import { decodeJSON, encodeJSON, eraseCookie, getCookie, isEmptyObject, isValidEmail, setCookie } from '../Utility/Utility';
import { GUEST_USER_COOKIE, MESSAGE_TYPE } from '../Utility/Constants';
import { ChatService } from '../services/chat';
import { MessagePayload, SignUpPayload, userType } from '../model/ChatModel';
import ChatBubble from './ChatBubble';

export default function ChatPopup() {
    /* state definitions goes here*/
    const [showPopup, setShowPopup] = useState(false);
    const [isEmailValid, setEmailValid] = useState(true);
    const [showChatHistory, setShowChatHistory] = useState(false);
    const [email, setEmail] = useState('');
    const [cookies, setCookieData] = useState(null);
    const [messages, setMessages] = useState([]);
    const messageTopRef: any = useRef();
    const messageBottomRef: any = useRef();
    const tenantServiceInstance = TenantService.getInstance();

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
        eraseCookie(GUEST_USER_COOKIE);
        const payload: SignUpPayload = {
            email: skip ? '' : email,
            userId: tenantServiceInstance.getUserId(),
            tenantId: String(tenantServiceInstance.getTenantId()),
        };
        ChatService.signUp(payload).then((res: any) => {
            setCookiesValue({ ...res, ...payload, id: res.userId });
            setShowChatHistory(true);
        });
    }

    const setCookiesValue = (data) => {
        setCookie(GUEST_USER_COOKIE, encodeJSON(data), 365, 'deskera.xyz');
        setCookieData(decodeJSON(getCookie(GUEST_USER_COOKIE)));
    }

    const getMessagesByThreadId = (threadId) => {
        ChatService.getMessagesByThreadId(threadId).then((res: any) => {
            setMessages(res);
        });
    }

    const sendMessage = (data, messageType = MESSAGE_TYPE.TEXT) => {
        const payload: MessagePayload = {
            threadId: cookies.threadId,
            type: messageType,
            body: {
                text: messageType === MESSAGE_TYPE.TEXT ? data : '',
                attachmentIds: messageType === MESSAGE_TYPE.MULTIMEDIA ? data : []
            },
            to: {
                users: [cookies.id],
                tenants: [tenantServiceInstance.getTenantId()]
            },
            from: {
                id: cookies.id,
                type: 'user'
            }
        };
        ChatService.sendMessages(payload).then(res => {

        });
    }

    /* effects goes here */
    useEffect(() => {
        if (!isEmptyObject(getCookie(GUEST_USER_COOKIE))) {
            let cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
            setCookieData(cookie);
            tenantServiceInstance.setUserId(cookie.userId);
            setShowChatHistory(true);
            getMessagesByThreadId(cookie.threadId);
        }
        scrollToBottom();
    }, []);

    /* helper renderer goes here */
    const renderHeader = () => {
        return <div className="border-radius-m row bg-blue p-v-l p-h-s">
            <DKLabel
                className="text-white fw-b fs-m"
                text={'Hey there 👋🏻'}
            />
        </div>;
    }

    const renderChatHistory = () => {
        return <div
            id="chat-wrapper"
            style={{ minHeight: 270, maxHeight: 270, overflowX: 'auto' }}
            className={`scroll-y-only-web hide-scroll-bar parent-width border-s parent-width border-radius-s border-box flex-wrap justify-content-start`}
        >
            <p ref={messageTopRef} />
            {showChatHistory && <div className="dk-chat-screen parent-size shadow-s border-radius-m">
                {messages?.map((message, index) => {
                    return (
                        // <ChatBubble
                        //     data={message}
                        //     searchText={''}
                        //     currentUserId={cookies?.id}
                        //     currentTenantId={tenantServiceInstance.getTenantId()}
                        //     onActionButtonClick={(messageId, threadId, attachemntId) => { }}
                        // />
                        ''
                    );
                })}
            </div>}
            <div id="bottom" ref={messageBottomRef} />
        </div>
    }

    const renderEmailInput = () => {
        return <>
            <ControlledInput
                value={email}
                placeHolder="enter your email or skip to chat"
                type={INPUT_TYPE.EMAIL}
                direction={INPUT_VIEW_DIRECTION.VERTICAL}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={() => { }}
                invalid={!isEmailValid}
                autoFocus
            />
            <div className="row">
                <DKButton
                    title="Submit"
                    className="fs-m border-m text-white bg-blue mt-m"
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
            guest={true}
            onSend={sendMessage}
            currentThreadId={cookies?.threadId}
        />
    }

    const renderPopup = () => {
        return (
            <div
                className="row position-absolute justify-content-between"
                style={{
                    opacity: showPopup ? 1 : 0,
                    width: 350,
                    bottom: 80,
                    right: 20,
                    transition: '.3s ease-in'
                }}
            >
                <div className="parent-size border-m shadow-m border-radius-m bg-white">
                    {renderHeader()}
                    {renderChatHistory()}
                    <div className="p-m">
                        {!showChatHistory && renderEmailInput()}
                        {showChatHistory && renderChatInput()}
                    </div>
                </div>
            </div>
        );
    }

    const renderBubble = () => {
        return <div
            className="bg-blue position-absolute d-flex align-items-center justify-content-center user-select-none"
            style={{
                bottom: 15,
                right: 20,
                height: 50,
                width: 50,
                borderRadius: 25
            }}
            onClick={() => setShowPopup(!showPopup)}
        >
            <DKIcon
                src={showPopup ? DKIcons.white.ic_add : DKIcons.white.ic_comment}
                className={`chat-float-icon`}
                style={{
                    transform: showPopup ? `rotate(138deg)` : `rotate(0deg)`,
                }}
            ></DKIcon>
        </div >
    }

    /* Main renderer goes here */
    return (
        <>
            {renderPopup()}
            {renderBubble()}
        </>
    )
}
