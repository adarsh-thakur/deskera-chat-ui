export enum WS_EVENT_TYPE {
    PING = '_ping_',
    PONG = '_pong_',
    NEW_CHAT_THREAD = 'new-chat-thread',
    NEW_CHAT_MESSAGE = 'new-chat-message',
    CHAT_MESSAGE_UPDATE = 'chat-message-updated',
    NEW_CONNECTION = 'new-connection',
}
export enum WEBSOCKET_READY_STATE {
    CONNECTING = 0,
    OPEN = 1,
    CLOSING = 2,
    CLOSED = 3,
}
export enum LOCAL_MESSAGE_EVENT_TYPE {
    NEW_MSG = 'new-message',
    NEW_THREAD = 'new-thread'
}
export enum FILE_TYPE {
	IMAGE = 'img',
	PDF = 'pdf',
	DOC = 'doc',
	EXCEL = 'excel',
	POWERPOINT = 'powerpoint',
	FILE = 'file',
}