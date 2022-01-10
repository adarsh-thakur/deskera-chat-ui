class ChatManager {
    static _messages: any[];
    static _totalCount: number;
    static scrollToBottom = true;
    static getTotalCount(): number {
        return this._totalCount;
    }
    static setTotalCount(value: number) {
        this._totalCount = value;
    }
    static getMessages(): any[] {
        return this._messages;
    }
    static setMessages(value: any[]) {
        this._messages = value;
    }

}

export default ChatManager;