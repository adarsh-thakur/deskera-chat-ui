const CHAT_OPEN_END_BASE = `v1/crm/chat/openep/`;
export const API_CONSTANT = {
    getOpenEndPoint: (endPoint) => `${CHAT_OPEN_END_BASE + endPoint}`,
    CHAT: {
        SIGNUP: `user/guest/signup`,
        CREATE_THREAD: `message/thread`,
        SEND_MESSAGE: `message`,
        GET_MESSAGES_BY_ID: (threadId: string) => `message/thread/${threadId}`,
        GET_THREAD: `thread`,
        UPLOAD_ATTACHMENT: `attachment`,
        GET_ATTACHMENT: (attachmentId: string) => `attachment/${attachmentId}`,
        DELETE_ATTACHMENT: (attachmentId: string) => `attachment/${attachmentId}`,
        GET_BULK_ATTACHMENT: `attachment/bulk-get`,
        GET_SETTINGS:`settings`,
        DELETE_MESSAGE: (messageId: string) => `message/${messageId}`
    }
}