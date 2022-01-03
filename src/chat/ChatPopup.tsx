import React, { useEffect, useRef, useState } from 'react';
import { DKIcons, DKIcon, DKLabel, INPUT_TYPE, INPUT_VIEW_DIRECTION, DKButton } from 'deskera-ui-library';
import ControlledInput from '../components/ControlledInput';
import ChatInputBox from './ChatInput';
import { TenantService } from '../services/tenant';
import { decodeJSON, encodeJSON, eraseCookie, getCookie, getDomain, isEmptyObject, isValidEmail, setCookie } from '../Utility/Utility';
import { GUEST_USER_COOKIE, MESSAGE_TYPE } from '../Utility/Constants';
import { ChatService } from '../services/chat';
import { MessagePayload, SignUpPayload, userType } from '../model/ChatModel';
import ChatBubble from './ChatBubble';
import { customEvent } from '../services/customEvents';
import { LOCAL_MESSAGE_EVENT_TYPE } from '../Utility/Enum';

export default function ChatPopup() {
    /* state definitions goes here*/
    const [showPopup, setShowPopup] = useState(false);
    const [isEmailValid, setEmailValid] = useState(true);
    const [showChatHistory, setShowChatHistory] = useState(false);
    const [email, setEmail] = useState('');
    const [cookies, setCookieData] = useState(null);
    const [messages, setMessages] = useState<any[]>([]);
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
        setCookie(GUEST_USER_COOKIE, encodeJSON(data), 365, getDomain(window.location.hostname));
        setCookieData(decodeJSON(getCookie(GUEST_USER_COOKIE)));
    }

    const getMessagesByThreadId = (threadId) => {
        ChatService.getMessagesByThreadId(threadId).then((res: { data: any[] }) => {
            setMessages(res.data.reverse());
        });
    }

    const sendMessage = (data, messageType = MESSAGE_TYPE.TEXT) => {
        const payload: MessagePayload = {
            threadId: cookies.threadId,
            type: messageType,
            body: {
                text: messageType === MESSAGE_TYPE.TEXT ? data : '',
                attachments: messageType === MESSAGE_TYPE.MULTIMEDIA ? data : []
            },
            to: {
                users: [cookies.id],
                tenants: [tenantServiceInstance.getTenantId()]
            },
            from: {
                id: cookies.userId,
                type: 'USER'
            }
        };
        ChatService.sendMessages(payload).then(res => {
            getMessagesByThreadId(cookies.threadId);
        });
    }

    const onMessageReceived = (data) => {
        const newMessage = JSON.parse(data.message);
        const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
        if (newMessage.from.id !== tenantServiceInstance.getUserId() && cookie) {
            getMessagesByThreadId(cookie.threadId);
        }
    }

    const onAttachmentAdd = (formData: FormData) => {
		ChatService.uploadAttachments(formData, cookies.threadId).then(
			(res:any) => {
                if (res?.attachments?.length) {
                    const attachments = res.attachments.map(attachment => ({
                        id: attachment._id,
                        url:attachment.downloadLink
                    }))
                    sendMessage(attachments, MESSAGE_TYPE.MULTIMEDIA);
                }
			}
		);
	};
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
        observer.observe(messageTopRef.current);
        observer.observe(messageBottomRef.current);
    }
    /* effects goes here */
    useEffect(() => {
        if (!isEmptyObject(getCookie(GUEST_USER_COOKIE))) {
            const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
            setCookieData(cookie);
            tenantServiceInstance.setUserId(cookie.userId);
            setShowChatHistory(true);
            getMessagesByThreadId(cookie.threadId);
        }
        scrollToBottom();
        createObserver();
        customEvent.on(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
        return () => {
            customEvent.remove(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    /* helper renderer goes here */
    const renderHeader = () => {
        return <div className="row bg-blue p-v-l p-h-s" style={{borderTopLeftRadius:8, borderTopRightRadius:8}}>
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
            className={`scroll-y-only-web hide-scroll-bar parent-width parent-width border-box flex-wrap justify-content-start`}
        >
            <div ref={messageTopRef} id="message-top-ref"></div>
            {showChatHistory && <div className="dk-chat-screen parent-size border-radius-m">
                {messages?.map((message, index) => {
                    const updatedMessage = { ...message, sender: message.from?.id == cookies?.id };
                    return (
                        <ChatBubble
                            data={updatedMessage}
                            onActionButtonClick={(messageId, threadId, attachemntId) => { }}
                        />
                    );
                })}
            </div>}
            <div ref={messageBottomRef} id="message-bottom-ref" />
        </div>
    }

    const renderEmailInput = () => {
        return <>
            <ControlledInput
                value={email}
                placeHolder="Enter your email or skip to chat"
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
            onAttachment={onAttachmentAdd}
        />
    }

    const renderPopup = () => {
        return (
            <div
                className="row position-absolute justify-content-between"
                style={{
                    opacity: showPopup ? 1 : 0,
                    visibility: showPopup ? 'visible' : 'hidden',
                    width: 350,
                    bottom: 80,
                    right: 20,
                    transition: 'visibility 0s, opacity 0.5s ease-in',
                }}
            >
                <div className="parent-size shadow-m border-radius-m bg-white">
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
