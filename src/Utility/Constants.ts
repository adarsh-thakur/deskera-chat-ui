export enum MESSAGE_TYPE {
    TEXT = 'text',
    MULTIMEDIA = 'multimedia'
}

export const GUEST_USER_COOKIE = 'x-guest-chat-user';

export const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}