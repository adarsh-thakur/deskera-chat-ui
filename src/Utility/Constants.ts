export enum MESSAGE_TYPE {
    TEXT = 'text',
    MULTIMEDIA = 'multimedia'
}

export const GUEST_USER_COOKIE = 'x-guest-chat-user';

export const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

export const KB_TO_BYTES = 1024;
export const MAX_FILE_SIZE = 5 * KB_TO_BYTES * KB_TO_BYTES;