import React, { useRef, useState } from 'react';
import ChatPopup from '../chat/ChatPopup';
import { MessagePayload, SignUpPayload } from '../model/ChatModel';
import { ChatService } from '../services/chat';
import { customEvent } from '../services/customEvents';
import { TenantService } from '../services/tenant';
import { CHAT_BUBBLE_POSITION, CHAT_POPUP_POSITION, DEFAULT_POSITION, GUEST_USER_COOKIE, MESSAGE_TYPE } from '../Utility/Constants';
import { LOCAL_MESSAGE_EVENT_TYPE } from '../Utility/Enum';
import { decodeJSON, encodeJSON, eraseCookie, getCookie, getDomain, getRandomHexString, isEmptyObject, isValidEmail, setCookie } from '../Utility/Utility';
import { DKIcon, DKIcons } from 'deskera-ui-library';
import ChatManager from '../manager/ChatManager';
import WebSocketService from '../services/webSocket';
export default function ChatWrapper(props) {
    const tenantService = TenantService.getInstance();
    const _webDocketService: any = WebSocketService.getInstance();
    const [cookies, setCookieData] = React.useState(props.cookies);
    const [messages, setMessages] = React.useState<any[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [currentThread, setCurrenThread] = useState(null);
    const _unreadCount = useRef(0);


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
                tenants: [tenantService.getTenantId()]
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
        if (newMessage.from.id !== tenantService.getUserId() && cookie) {
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
            userId: tenantService.getUserId(),
            tenantId: String(tenantService.getTenantId()),
        };
        return ChatService.signUp(payload).then((res: any) => {
            setCookiesValue({ ...res, ...payload, id: res.userId });
            setShowChat(true);
            getMessagesByThreadId(res.threadId);
            return res;
        })
            .catch(error => {
                console.log(error);
                tenantService.setUserId(getRandomHexString())
            });
    }
    const clearSession = () => {
        tenantService.setUserId(getRandomHexString());
        setMessages([]);
        setCurrenThread(null);
        eraseCookie(GUEST_USER_COOKIE, getDomain(window.location.hostname));
        _webDocketService.openConnection();
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
            className="position-fixed d-flex align-items-center justify-content-center user-select-none"
            style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: props?.settings?.bubbleColor,
                ...CHAT_BUBBLE_POSITION[props?.settings?.bubblePosition || DEFAULT_POSITION]
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
                setCurrenThread(thread);
                getMessagesByThreadId(threadId);
            } else {
                clearSession();
            }
        });
    }
    const onThreadClose = (data) => {
        const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
        const eventData = JSON.parse(data.message);
        if (eventData?.closed && eventData._id === cookie?.threadId) {
            setCurrenThread({ ...currentThread, closed: true });
        }
    }
    /* effect will go here */
    React.useEffect(() => {
        if (!isEmptyObject(getCookie(GUEST_USER_COOKIE))) {
            const cookie = decodeJSON(getCookie(GUEST_USER_COOKIE));
            if (cookie) {
                setCookiesValue(cookie);
                validateThread(cookie.threadId);
            }
        } else if (props.email && isValidEmail(props.email)) {
            // if deskeraChat initialized with email, then sign up user
            signUp(props.email);
        }
        // clear the chat after sessionDuration
        // if (props?.sessionDuration > 0) {
        //     setTimeout(() => {
        //         clearSession();
        //     }, props.sessionDuration);
        // }
        customEvent.on(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
        customEvent.on(LOCAL_MESSAGE_EVENT_TYPE.THREAD_CLOSED, (data) => onThreadClose(data));
        return () => {
            customEvent.remove(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
            customEvent.remove(LOCAL_MESSAGE_EVENT_TYPE.THREAD_CLOSED, (data) => onThreadClose(data));
        }
    }, []);

    React.useEffect(() => {
        if (ChatManager.scrollToBottom) {
            document.getElementById('message-bottom-ref')?.scrollIntoView({ behavior: 'smooth' });
        }
        ChatManager.scrollToBottom = true;
    }, [messages]);
    React.useEffect(() => {
        setShowChat(!isEmptyObject(currentThread));
    }, [currentThread])
    /* renderer will go here */
    return <>
        {(!showPopup && showNotification) && <div className="notification">{_unreadCount.current}</div>}
        {renderBubble()}
        {showPopup &&
            <>
                <div
                    className="column position-fixed justify-content-between shadow-m border-radius-m bg-white"
                    style={{
                        opacity: showPopup ? 1 : 0,
                        visibility: showPopup ? 'visible' : 'hidden',
                        width: 350,
                        height: '80vh',
                        transition: 'visibility 0s, opacity 0.5s ease-in',
                        ...CHAT_POPUP_POSITION[props?.settings?.bubblePosition || DEFAULT_POSITION]
                    }}
                >
                    <ChatPopup
                        {...props}
                        settings={props.settings}
                        messages={messages}
                        currentThread={currentThread}
                        showChat={showChat}
                        tenantId={tenantService.getTenantId()}
                        userId={tenantService.getUserId()}
                        onSignUp={(email) => signUp(email)}
                        onSendMessage={(data, type) => sendMessage(data, type)}
                        onAttachmentAdd={onAttachmentAdd}
                        reachedTop={onReachedTop}
                        onPopupClose={() => onBubbleClick()}
                        startNewChat={() => clearSession()}
                    />
                </div>
            </>
        }
    </>
}
