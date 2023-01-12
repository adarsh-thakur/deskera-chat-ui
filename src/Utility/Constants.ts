import { AUTO_RESPONSE_KEYS, LOCAL_STORAGE_KEYS } from "./Enum";

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
        bottom: 20,
        right: 20,
    },
    TOP_RIGHT: {
        top: 20,
        right: 20,
    },
    TOP_LEFT: {
        top: 20,
        left: 20,
    },
    BOTTOM_LEFT: {
        bottom: 20,
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
  [AUTO_RESPONSE_KEYS.TALK_TO_REP]: {
    message: "I want to talk to a Specialist 🙋‍♂️",
    nextStep: AUTO_RESPONSE_KEYS.EMAIL_STEP
  },
  [AUTO_RESPONSE_KEYS.BOOK_A_MEET]: {
    message: "I want to schedule a meeting",
    nextStep: AUTO_RESPONSE_KEYS.EMAIL_STEP
  },
  [AUTO_RESPONSE_KEYS.EMAIL_STEP]: {
    message: "In case we get disconnected, can we have your email?",
    nextStep: AUTO_RESPONSE_KEYS.NAME_STEP,
    userInfoRequired: true,
    key: "email"
  },
  [AUTO_RESPONSE_KEYS.NAME_STEP]: {
    message: "Thanks! And can we get your name?",
    nextStep: AUTO_RESPONSE_KEYS.COMPANY_STEP,
    userInfoRequired: true,
    key: "name"
  },
  [AUTO_RESPONSE_KEYS.COMPANY_STEP]: {
    message: "And the company you work for?",
    nextStep: AUTO_RESPONSE_KEYS.PHONE_STEP,
    userInfoRequired: true,
    key: "organization"
  },
  [AUTO_RESPONSE_KEYS.PHONE_STEP]: {
    message: "Last Questions? <br/> What is the best number to reach you at?",
    getNextStep: () =>
      localStorage.getItem(LOCAL_STORAGE_KEYS.FIRST_AUTO_RESPONSE_INPUT_KEY) ===
      AUTO_RESPONSE_KEYS.TALK_TO_REP
        ? undefined
        : AUTO_RESPONSE_KEYS.MEET_SLOT_STEP,
    userInfoRequired: true,
    key: "phone"
  }
};
