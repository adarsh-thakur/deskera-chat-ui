class ChatManager {
    private _messages: Array<any>;
    public getMessages(): Array<any> {
        return this._messages;
    }
    public setMessages(value: Array<any>) {
        this._messages = value;
    }

}

export default ChatManager;