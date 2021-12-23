import { MessagePayload } from '../model/ChatModel';
import httpClient from '../services/http';
import { API_CONSTANT } from '../Utility/ApIConstant';
export const ChatService = {
    signUp: (payload: any) => httpClient.post(`${API_CONSTANT.getOpenEndPoint(API_CONSTANT.CHAT.SIGNUP)}`, payload),
    getMessagesByThreadId: (threadId: any, params = null) => {
        if (!params) params = { pageNo: 1, pageSize: 10 };
        return httpClient.get(`${API_CONSTANT.getOpenEndPoint(API_CONSTANT.CHAT.GET_MESSAGES_BY_ID(threadId))}`, { params });
    },
    sendMessages:(payload:MessagePayload) => httpClient.post(`${API_CONSTANT.getOpenEndPoint(API_CONSTANT.CHAT.SEND_MESSAGE)}`, payload),
    createChatThread: (payload: any) => { }
}