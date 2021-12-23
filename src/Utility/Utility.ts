import { Buffer } from 'buffer';
import { REGEX } from './Constants';

declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean
    }
}
export const isEmptyObject = (objectToCheck: any): boolean => {
    if (objectToCheck === null || objectToCheck === undefined || objectToCheck.length === 0)
        return true;
    if (Array.isArray(objectToCheck)) return !objectToCheck.length;
    if (typeof objectToCheck === "string") return !objectToCheck.trim().length;
    return Object.keys(objectToCheck).length === 0;
}
export const getFormattedTimeFromDate = (date: Date): String => {
    let formattedTime = '';
    return formattedTime;
}
export const highlightString = (str: String, search: String): String => {
    let highlightedString = str;
    return highlightedString;
}
export const triggerDownload = (blobContent, fileName, altSrc = null) => {
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("download", fileName);
    /* Supporting IE */
    if (blobContent && navigator.msSaveBlob) {
        navigator.msSaveBlob(blobContent, fileName);
    } else if (downloadAnchor.download !== undefined) {
        /* Checking If download feature supported in browser */
        downloadAnchor.href = blobContent ? URL.createObjectURL(blobContent) : altSrc;
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }
}
export const getRandomHexString = (length = 24) => {
    const chars = "0123456789abcdef";
    let result = "";
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
export const decodeBase64Uri: (decodedData: string) => string = (encodedData: string) => {
    return decodeURIComponent(Buffer.from(encodedData, 'base64').toString('ascii'));
};
export const encodeBase64Uri: (encodedData: string) => string = (decodedData: string) => {
    return Buffer.from(encodeURIComponent(decodedData), 'ascii').toString('base64');
};
export const isJson = (str: string) => {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
export const isValidEmail = (email: string) => {
    if (isEmptyObject(email.trim())) {
        return false;
    }
    return REGEX.EMAIL.test(String(email).toLowerCase());
}
export const setCookie = (name, value, days, domain) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    if (domain) {
        domain = '; domain=' + domain;
    }
    document.cookie = name + "=" + value + expires + domain + "; path=/";

}
export const getCookie = (name) => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
export const eraseCookie = (cookieName) => {
    document.cookie = cookieName + '=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}
export const encodeJSON = (json) => {
    let temp = encodeURI(JSON.stringify(json));
    return btoa(temp);
}
export const decodeJSON = (base64String) => {
    return JSON.parse(decodeURI(atob(base64String)));
}
