export interface SignUpPayload {
    userId: string;
    tenantId: string;
    email?: string;
}
export type threadType = 'individual' | 'group';
export interface ThreadPayload {
    threadType: threadType;
    source: string;
    threadName?: string;
    participants: {
        users?: string[];
        tenants?: string[];
    };
}
export type userType = 'USER' | 'TENANT';
export type messageType = "text" | "multimedia";
export interface MessagePayload {
    from: {
        id: string;
        type: userType;
    },
    to: {
        users?: string[];
        tenants?: string[];
    },
    type: messageType;
    body: {
        text?: string;
        stepId?: string;
        attachments?: { id: string, url: string }[];
    },
    threadId: string;
}