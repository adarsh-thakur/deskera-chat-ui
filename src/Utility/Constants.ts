export enum MESSAGE_TYPE {
    TEXT = 'text',
    AUTO_RESPONSE = 'auto_response',
    MULTIMEDIA = 'multimedia'
}

export const GUEST_USER_COOKIE = 'x-guest-chat-user';

export const REGEX = {
    EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    MOBILE: /^(\+(([0-9]){1,3})(-|.))?((((([0-9]){2,3})(-|.)){1,2}([0-9]{4,10}))|([0-9]{10}))$/,
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
export const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const AUTO_RESPONSE = {
    "TALK_TO_REP": {
        "message": "I want to talk to a Specialist 🙋‍♂️",
        "nextStep": "EMAIL_STEP"
    },
    "BOOK_A_MEET": {
        "message": "I want to schedule a meeting",
        "nextStep": "EMAIL_STEP"
    },
    "EMAIL_STEP": {
        "message": "In case we get disconnected, can we have your email?",
        "nextStep": "NAME_STEP"
    },
    "NAME_STEP": {
        "message": "Thanks! And can we get your name?",
        "nextStep": "COMPANY_STEP"
    },
    "COMPANY_STEP": {
        "message": "And the company you work for?",
        "nextStep": "PHONE_STEP"
    },
    "PHONE_STEP": {
        "message": "Last Questions? <br/> What is the best number to reach you at?",
        "nextStep": "SCHEDULE_STEP"
    },
}
