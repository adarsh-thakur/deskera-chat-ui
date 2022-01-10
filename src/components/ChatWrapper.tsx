import React, { useRef, useState } from 'react';
import ChatPopup from '../chat/ChatPopup';
import { MessagePayload, SignUpPayload } from '../model/ChatModel';
import { ChatService } from '../services/chat';
import { customEvent } from '../services/customEvents';
import { TenantService } from '../services/tenant';
import { GUEST_USER_COOKIE, MESSAGE_TYPE } from '../Utility/Constants';
import { LOCAL_MESSAGE_EVENT_TYPE } from '../Utility/Enum';
import { decodeJSON, encodeJSON, eraseCookie, getCookie, getDomain, isEmptyObject, isValidEmail, setCookie } from '../Utility/Utility';
import { DKIcon, DKIcons } from 'deskera-ui-library';
import ChatManager from '../manager/ChatManager';
export default function ChatWrapper(props) {
    const tenantService = TenantService.getInstance();
    const [cookies, setCookieData] = React.useState(props.cookies);
    const [messages, setMessages] = React.useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const _unreadCount= useRef(0);


    const getMessagesByThreadId = (threadId, params = null) => {
        ChatService.getMessagesByThreadId(threadId, params).then((res: any) => {
            let messages = res.data;
            messages = messages.map((message) => ({ ...message, sender: message.from?.id == tenantService.getUserId() }));
            ChatManager.setMessages(messages);
            ChatManager.setTotalCount(res.totalCount);
            setMessages(ChatManager.getMessages().reverse());
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
                tenants: [props.tenantId]
            },
            from: {
                id: cookies.userId,
                type: 'USER'
            }
        };
        let lastMessages = ChatManager.getMessages();
        lastMessages.push({ ...payload, sentAt: new Date().toISOString() });
        lastMessages = lastMessages.map((message) => ({ ...message, sender: message.from?.id == tenantService.getUserId() }));
        ChatManager.setMessages(lastMessages);
        ChatManager.setTotalCount(ChatManager.getTotalCount() + 1);
        setMessages(lastMessages);

        ChatService.sendMessages(payload).then(res => {
            getMessagesByThreadId(cookies.threadId);
        });
    }
    const onMessageReceived = (data) => {
        const newMessage = JSON.parse(data.message);
        const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
        if (newMessage.from.id !== props.userId && cookie) {
            if (!showPopup) {
                _unreadCount.current = _unreadCount.current + 1;
                setShowNotification(true);
            }
            getMessagesByThreadId(cookie.threadId);
        }
    }
    const onAttachmentAdd = (formData: FormData) => {
        ChatService.uploadAttachments(formData, cookies.threadId).then(
            (res: any) => {
                if (res?.attachments?.length) {
                    const attachments = res.attachments.map(attachment => ({
                        id: attachment._id,
                        url: attachment.downloadLink
                    }))
                    sendMessage(attachments, MESSAGE_TYPE.MULTIMEDIA);
                }
            }
        );
    }
    const setCookiesValue = (data) => {
        setCookie(GUEST_USER_COOKIE, encodeJSON(data), 365, getDomain(window.location.hostname));
        setCookieData(decodeJSON(getCookie(GUEST_USER_COOKIE)));
    }
    const signUp = (email) => {
        eraseCookie(GUEST_USER_COOKIE, getDomain(window.location.hostname));
        const payload: SignUpPayload = {
            email,
            userId: props.userId,
            tenantId: String(props.tenantId),
        };
        return ChatService.signUp(payload).then((res: any) => {
            setCookiesValue({ ...res, ...payload, id: res.userId });
            setShowChat(true);
            return res;
        });
    }
    const clearSession = () => {
        eraseCookie(GUEST_USER_COOKIE, getDomain(window.location.hostname));
        setMessages([]);
    }
    const sendUserInfoAsMessage = () => {
        let message = `Name: ${props.name}\nPhone: ${props.phone}\nEmail: ${props.email}`;
        props.onSendMessage(message)
    }
    const onReachedTop = () => {
        if (ChatManager.getMessages()?.length < ChatManager.getTotalCount()) {
            ChatManager.scrollToBottom = false;
            let params = { pageNo: 1, pageSize: ChatManager.getMessages().length + 10 };
            getMessagesByThreadId(cookies.threadId, params);
        }
    }
    const onBubbleClick = () => {
        _unreadCount.current = 0;
        setShowNotification(false);
        setShowPopup(!showPopup);
    }
    const renderBubble = () => {
        return <div
            className="position-absolute d-flex align-items-center justify-content-center user-select-none"
            style={{
                bottom: 15,
                right: 20,
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: props.accentColor ? props.accentColor : '#1c73e8',
            }}
            onClick={() => onBubbleClick()}
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
    const validateThread = (threadId) => {
        ChatService.getThread().then((res: any) => {
            if (res?.data?.length) {
                const thread = res.data.find(thread => thread._id === threadId);
                if (thread && !thread.closed) {
                    getMessagesByThreadId(threadId);
                    setShowChat(true);
                } else {
                    clearSession();
                }
            } else {
                clearSession();
            }
        });
    }
    /* effect will go here */
    React.useEffect(() => {
        if (!isEmptyObject(getCookie(GUEST_USER_COOKIE))) {
            const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
            setCookiesValue(cookie);
            validateThread(cookie.threadId);
        } else if (props.email && isValidEmail(props.email)) {
            // if deskeraChat initialized with email, then sign up user
            signUp(props.email);
        }
        // clear the chat after sessionDuration
        if (props?.sessionDuration > 0) {
            setTimeout(() => {
                clearSession();
            }, props.sessionDuration);
        }
        customEvent.on(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
        return () => {
            customEvent.remove(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
        }
    }, []);

    React.useEffect(() => {
        if (ChatManager.scrollToBottom) {
            document.getElementById('message-bottom-ref')?.scrollIntoView({ behavior: 'smooth' });
        }
        ChatManager.scrollToBottom = true;
    }, [messages, showPopup]);

    /* renderer will go here */
    return <>
        {(!showPopup && showNotification) && <div className="notification">{_unreadCount.current}</div>}
        {renderBubble()}
        {showPopup &&
            <>
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
                    <ChatPopup
                        {...props}
                        messages={messages}
                        cookies={cookies}
                        showChat={showChat}
                        tenantId={tenantService.getTenantId()}
                        userId={tenantService.getUserId()}
                        onSignUp={(email) => signUp(email)}
                        onSendMessage={(data, type) => sendMessage(data, type)}
                        onAttachmentAdd={onAttachmentAdd}
                        reachedTop={onReachedTop}
                    />
                </div>
            </>
        }
    </>
}
