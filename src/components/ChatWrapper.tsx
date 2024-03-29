import React, { useRef, useState } from 'react';
import ChatPopup from '../chat/ChatPopup';
import { MessagePayload, SignUpPayload } from '../model/ChatModel';
import { ChatService } from '../services/chat';
import { customEvent } from '../services/customEvents';
import { TenantService } from '../services/tenant';
import { AUTO_RESPONSE, CHAT_BUBBLE_POSITION, CHAT_POPUP_POSITION, DEFAULT_POSITION, GUEST_USER_COOKIE, MESSAGE_TYPE } from '../Utility/Constants';
import { AUTO_RESPONSE_KEYS, LOCAL_MESSAGE_EVENT_TYPE, LOCAL_STORAGE_KEYS } from '../Utility/Enum';
import { decodeJSON, encodeJSON, eraseCookie, getCookie, getDomain, getRandomHexString, isEmptyObject, isValidEmail, setCookie } from '../Utility/Utility';
import { DKIcon, DKIcons } from './common';
import ChatManager from '../manager/ChatManager';
import WebSocketService from '../services/webSocket';
import { BDR } from '../services/meeting';
import { IChatUserContactPayload, IMeetMember } from '../model/MeetModel';
import { BookMeetService } from '../services/bookMeet';
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
    const [bdrInfo, setBDRInfo] = useState(null);
    const lastAutoChatStep = useRef(getLastActiveChatStep());
    const [activeUserInfo, setActiveUserInfo] = useState(null);

    function getLastActiveChatStep(lastInputStep = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_AUTO_RESPONSE_INPUT_KEY), forAutoResponse = false) {
        let nextStep = AUTO_RESPONSE[lastInputStep]?.nextStep || AUTO_RESPONSE[lastInputStep]?.getNextStep?.() || null;
        if (nextStep === AUTO_RESPONSE_KEYS.GET_BACK && !forAutoResponse) {
            return null;
        }
        return nextStep;
    }

    const onBDRInfoFetched = (info) => {
        setBDRInfo(info);
    }
    const getMessagesByThreadId = (threadId, params = null) => {
        ChatService.getMessagesByThreadId(threadId, params).then((res: any) => {
            let messages = res.data;
            messages = messages.map((message) => ({ ...message, sender: message.from?.id == tenantService.getUserId() }));
            ChatManager.setMessages(messages);
            ChatManager.setTotalCount(res.totalCount);
            setMessages(ChatManager.getMessages().reverse());
        });
    }
    const createCRMContact = async () => {
        try {
            const userData: IMeetMember = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA) ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) : {};
            const contactPayload: IChatUserContactPayload = {
                ...userData,
                owner_id: bdrInfo?.iamUserId
              };
            const contactResponse: any = await BookMeetService.getInstance().createMeetingInvitee(
                Number(tenantService.getTenantId()),
                contactPayload
            );

            if (contactResponse?.body?.id) {
                userData.id = contactResponse.body.id;
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
                setActiveUserInfo(userData);
            }
        } catch(err) {}
    }
    const onAutoResponseMessage = (stepId, message, cookieData) => {
        let body = {
            stepId,
            text: message,
            nextStepId: getLastActiveChatStep(stepId, true),
            attachments: [],
        }
        const payload: MessagePayload = {
            threadId: cookieData.threadId,
            type: MESSAGE_TYPE.TEXT,
            body,
            to: {
                users: [cookieData.id],
                tenants: [tenantService.getTenantId()]
            },
            from: {
                id: cookieData.userId,
                type: 'USER'
            }
        };
        let lastMessages = ChatManager.getMessages();
        const prevThread = [...lastMessages];
        lastMessages.push({ ...payload, sentAt: new Date().toISOString() });
        lastMessages = lastMessages.map((message) => ({ ...message, sender: message.from?.id == tenantService.getUserId() }));
        ChatManager.setMessages(lastMessages);
        ChatManager.setTotalCount(ChatManager.getTotalCount() + 1);
        setMessages(lastMessages);

        return ChatService.sendMessages(payload).then(res => {
            const stepData = AUTO_RESPONSE[stepId];
            localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_AUTO_RESPONSE_INPUT_KEY, stepId);

            if (stepData?.key) {
                const userData = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA) ? JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA)) : {};
                userData[stepData.key] = message;
                localStorage.setItem(LOCAL_STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
            }

            if (stepId === AUTO_RESPONSE_KEYS.PHONE_STEP) {
                createCRMContact();
            }

            lastAutoChatStep.current = getLastActiveChatStep(stepId);
            getMessagesByThreadId(cookies.threadId);
        }).catch(err => {
            /* reset to previous state on message send failure */
            setMessages(prevThread);
            ChatManager.setMessages(prevThread);
            ChatManager.setTotalCount(ChatManager.getTotalCount() - 1)
            return Promise.reject(err);
        });
    }
    const sendMessage = (data, messageType = MESSAGE_TYPE.TEXT, cookieData = null) => {
        const payload: MessagePayload = {
            threadId: cookies.threadId,
            type: messageType as any,
            body: {
                text: messageType === MESSAGE_TYPE.TEXT ? data : '',
                attachments: messageType === MESSAGE_TYPE.MULTIMEDIA ? data : []
            },
            to: {
                users: [cookieData ? cookieData.id : cookies.id],
                tenants: [tenantService.getTenantId()]
            },
            from: {
                id: cookieData ? cookieData.userId : cookies.userId,
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
        return showPopup ? null : <div
            className="dk-chat-position-fixed dk-chat-z-index-max dk-chat-d-flex dk-chat-align-items-center dk-chat-justify-content-center dk-chat-user-select-none"
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
                src={DKIcons.ic_chat_white}
                className={`dk-chat-chat-float-icon dk-chat-ic-s`}
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
    const onBDRItemClicked = (item) => {
        lastAutoChatStep.current = getLastActiveChatStep(item);
        eraseCookie(GUEST_USER_COOKIE, getDomain(window.location.hostname));
        const payload: SignUpPayload = {
            userId: tenantService.getUserId(),
            tenantId: String(tenantService.getTenantId()),
        };
        ChatService.signUp(payload)
            .then((res: any) => {
                localStorage.setItem(LOCAL_STORAGE_KEYS.FIRST_AUTO_RESPONSE_INPUT_KEY, item);
                setCookiesValue({ ...res, ...payload, id: res.userId });
                setShowChat(true);
                onAutoResponseMessage(item, AUTO_RESPONSE[item].message, { ...res, ...payload, id: res.userId });
            })
            .catch(err => {
                console.log(err);
                tenantService.setUserId(getRandomHexString())
            })
    }
    const getActiveUserInfo = () => {
        if (!isEmptyObject(activeUserInfo)) return activeUserInfo;

        let userData: any = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_DATA);
        userData = userData ? JSON.parse(userData) : null;
        return userData;
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
        customEvent.on('bdfInfoFetched', onBDRInfoFetched);
        onBDRInfoFetched(BDR.getBDRInfo());

        customEvent.on(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
        customEvent.on(LOCAL_MESSAGE_EVENT_TYPE.THREAD_CLOSED, (data) => onThreadClose(data));
        return () => {
            customEvent.remove(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, (data) => onMessageReceived(data));
            customEvent.remove(LOCAL_MESSAGE_EVENT_TYPE.THREAD_CLOSED, (data) => onThreadClose(data));
        }
    }, []);

    React.useEffect(() => {
        if (ChatManager.scrollToBottom && showPopup) {
            setTimeout(() => document.getElementById('message-bottom-ref')?.scrollIntoView({ behavior: 'smooth' }), 100);
        }
        ChatManager.scrollToBottom = true;
    }, [messages, showPopup]);
    React.useEffect(() => {
        setShowChat(!isEmptyObject(currentThread));
    }, [currentThread]);

    React.useEffect(() => {
        if (isEmptyObject(bdrInfo) || !isEmptyObject(getCookie(GUEST_USER_COOKIE))) return;

        setTimeout(() => {
            setShowPopup(true);
        }, 3000);
    }, [bdrInfo]);
    /* renderer will go here */
    return <>
        {(!showPopup && showNotification) && <div className="dk-chat-z-index-max dk-chat-notification">{_unreadCount.current}</div>}
        {renderBubble()}
        {showPopup &&
            <>
                <div
                    className="dk-chat-column dk-chat-position-fixed dk-chat-z-index-max dk-chat-justify-content-between dk-chat-shadow-m dk-chat-border-radius-m dk-chat-bg-white"
                    style={{
                        opacity: showPopup ? 1 : 0,
                        visibility: showPopup ? 'visible' : 'hidden',
                        width: 350,
                        height: '80vh',
                        maxHeight: 600,
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
                        bdrInfo={bdrInfo}
                        activeUserInfo={getActiveUserInfo()}
                        stepId={lastAutoChatStep.current}
                        onBDRItemClicked={onBDRItemClicked}
                        onUserInfoSend={(value) => onAutoResponseMessage(lastAutoChatStep.current, value, cookies)}
                    />
                </div>
            </>
        }
    </>
}
