export enum MESSAGE_TYPE {
    TEXT = 'text',
    MULTIMEDIA = 'multimedia'
}

export const GUEST_USER_COOKIE = 'x-guest-chat-user';

export const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    HEX_COLOR:/^#([0-9a-f]{3}){1,2}$/i,
}

export const KB_TO_BYTES = 1024;
export const MAX_FILE_SIZE = 5 * KB_TO_BYTES * KB_TO_BYTES;
export const DEFAULT_POSITION = 'BOTTOM_RIGHT';
export const DEFAULT_COLOR = '#1c73e8';

export const CHAT_BUBBLE_POSITION = {
    BOTTOM_RIGHT: {
        bottom: 15,
        right: 20,
    },
    TOP_RIGHT: {
        top: 15,
        right: 20,
    },
    TOP_LEFT: {
        top: 15,
        left: 20,
    },
    BOTTOM_LEFT: {
        bottom: 15,
        left: 20,
    },
}
export const CHAT_POPUP_POSITION = {
    BOTTOM_RIGHT: {
        bottom: 80,
        right: 20,
    },
    TOP_RIGHT: {
        top: 80,
        right: 20,
    },
    TOP_LEFT: {
        top: 80,
        left: 20,
    },
    BOTTOM_LEFT: {
        bottom: 80,
        left: 20,
    },
}