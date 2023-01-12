export enum WS_EVENT_TYPE {
    PING = '_ping_',
    PONG = '_pong_',
    NEW_CHAT_THREAD = 'new-chat-thread',
    NEW_CHAT_MESSAGE = 'new-chat-message',
    CHAT_MESSAGE_UPDATE = 'chat-message-updated',
    CHAT_THREAD_CLOSED = 'chat-thread-closed',
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
    THREAD_CLOSED = 'thread-closed',
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
export const KEY_CODES = {
    ARROW_UP: "ArrowUp",
    ARROW_DOWN: "ArrowDown",
    ARROW_LEFT: "ArrowLeft",
    ARROW_RIGHT: "ArrowRight",
    ENTER: "Enter",
    ESCAPE: "Escape",
};
export const INPUT_VIEW_DIRECTION = {
    HORIZONTAL: "HORIZONTAL",
    VERTICAL: "VERTICAL",
};
export enum INPUT_TYPE {
    TEXT= "text",
    PASSWORD= "password",
    NUMBER= "number",
    EMAIL= "email",
    DATE= "date",
    URL= "url",
    PHONE= "phone",
    SELECT= "select",
    MULTI_SELECT= "multi-select",
    CHECKBOX= "checkbox",
    BUTTON= "button",
    MORE= "more",
    LONG_TEXT= "long text",
    DROPDOWN= "dropdown",
};

export enum AUTO_RESPONSE_KEYS {
    TALK_TO_REP = "TALK_TO_REP",
    BOOK_A_MEET = "BOOK_A_MEET",
    EMAIL_STEP = "EMAIL_STEP",
    NAME_STEP = "NAME_STEP",
    COMPANY_STEP = "COMPANY_STEP",
    PHONE_STEP = "PHONE_STEP",
    MEET_SLOT_STEP = "MEET_SLOT_STEP",
    GET_BACK = "GET_BACK"
};

export enum LOCAL_STORAGE_KEYS {
    FIRST_AUTO_RESPONSE_INPUT_KEY = "FIRST_AUTO_RESPONSE_INPUT_KEY",
    LAST_AUTO_RESPONSE_INPUT_KEY = "LAST_AUTO_RESPONSE_INPUT_KEY",
    USER_DATA = "USER_DATA"
}