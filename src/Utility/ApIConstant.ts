const CHAT_OPEN_END_BASE = `v1/crm/chat/openep/`;
const BOOK_MEET_OPEN_END_BASE = `v1/crm/book-meeting/openep/`;
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
        GET_SETTINGS: `settings`,
        DELETE_MESSAGE: (messageId: string) => `message/${messageId}`
    },
    BOOK_MEET : {
        GET_SLOTS: (tenantId: number, userId: number) => `${BOOK_MEET_OPEN_END_BASE}bdr/${tenantId}/slots/${userId}`,
        CREATE_EVENT: (tenantId: number) => `${BOOK_MEET_OPEN_END_BASE}bdr/${tenantId}/create/activity`
    },
    BDR: {
        GET: (tenantId, tzOffset) => `v1/crm/book-meeting/openep/bdr/${tenantId}?tzOffset=${tzOffset}`,
    }
}