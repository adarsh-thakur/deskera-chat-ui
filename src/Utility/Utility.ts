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
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    if (domain) {
        domain = '; domain=' + domain;
    }
    document.cookie = name + "=" + value + expires + domain + "; path=/";

}
export const getCookie = (name) => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
export const eraseCookie = (cookieName, domain) => {
    document.cookie = cookieName + '=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + domain + ';';
}
export const encodeJSON = (json) => {
    let temp = encodeURI(JSON.stringify(json));
    return btoa(temp);
}
export const decodeJSON = (base64String) => {
    try {
        return JSON.parse(decodeURI(atob(base64String)))
    } catch (error) {
        return null;
    }
}
/**
 *
 * @param url - url from which to extract the domain
 * @param subdomain - need the subdomain to be extracted
 * @returns - returns the domain
 */
export const getDomain = (url, subdomain = false) => {
    url = url.replace(/(https?:\/\/)?(www.)?/i, '');
    if (!subdomain) {
        url = url.split('.');
        url = url.slice(url.length - 2).join('.');
    }
    if (url.indexOf('/') !== -1) {
        return url.split('/')[0];
    }
    return url;
}
export const getFormattedTime =(date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let x = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let time = hours + ":" + minutes + " " + x;
    return time;
  }
