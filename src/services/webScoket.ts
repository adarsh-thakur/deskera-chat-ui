import { LOCAL_MESSAGE_EVENT_TYPE, WEBSOCKET_READY_STATE, WS_EVENT_TYPE } from "../Utility/Enum";
import { decodeBase64Uri, isJson } from "../Utility/Utility";
import { customEvent } from "./customEvents";
import { TenantService } from "./tenant";

const WS_CONNECTION_RETRY_INTERVAL = 15000;
const WS_RETRY_INTERVAL_DOUBLING_COUNT = 4;
const WS_CONNECTION_RETRY_LIMIT = 20;
const WS_PING_FREQUENCY = 30000;
export default class WebSocketService {
    private _webSocket: WebSocket;
    private static _instance: WebSocketService;
    private _wsPingIntervalId: any;
    private _retryCount: number;
    private _retryIntervalInMs: number;
    private _tenantService: TenantService = TenantService.getInstance();

    public static getInstance(): WebSocketService {
        if (!this._instance) {
            this._instance = new WebSocketService();
        }
        return this._instance;
    }
    public getWebSocket(): WebSocket {
        return this._webSocket;
    }
    private openConnection(): void {
        this._webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
        this._webSocket.onopen = (event) => this.onOpen(event);
    }
    private startWebSocketPing(): void {
        this._wsPingIntervalId = setInterval(() => {
            if (this._webSocket.readyState !== WEBSOCKET_READY_STATE.OPEN) {
                console.log(`[${new Date().toISOString()}] not sending ping to server because connection is not in open state`);
                return;
            }
            console.log(`[${new Date().toISOString()}] sending ping to server`);
            this._webSocket.send(JSON.stringify({
                wsUserId: this._tenantService.getUserId(),
                eventType: WS_EVENT_TYPE.PING,
                message: WS_EVENT_TYPE.PING,
            }));
        }, WS_PING_FREQUENCY);
    }
    private stopWebSocketPing(): void {
        if (!this._wsPingIntervalId) {
            return;
        }
        clearInterval(this._wsPingIntervalId);
        this._wsPingIntervalId = null;
    }
    private startConnectionRetry(retryIntervalInMs, retryCount): void {
        if (retryCount >= WS_CONNECTION_RETRY_LIMIT) return;
        this.openConnection();
        if (retryCount % WS_RETRY_INTERVAL_DOUBLING_COUNT === 0) {
            retryIntervalInMs *= 2;
        }
        this._retryIntervalInMs = retryIntervalInMs;
        this._retryCount = retryCount;

        setTimeout(() => {
            if (this._webSocket && this._webSocket.readyState === WEBSOCKET_READY_STATE.CONNECTING) {
                this.startConnectionRetry(this._retryIntervalInMs, this._retryCount);
                return;
            }
            if (this._webSocket && this._webSocket.readyState === WEBSOCKET_READY_STATE.OPEN) {
                return;
            }
            this._retryCount++;
            this.startConnectionRetry(this._retryIntervalInMs, this._retryCount);
        }, this._retryIntervalInMs);
    }
    protected onOpen = (event: any) => {
        if (this._webSocket.readyState === WEBSOCKET_READY_STATE.OPEN) {
            console.log('connection opened');
            this._webSocket.send(JSON.stringify({
                wsUserId: this._tenantService.getUserId(),
                eventType: WS_EVENT_TYPE.NEW_CONNECTION
            }));

            this._webSocket.onerror = (event) => this.onError(event);
            this._webSocket.onclose = (event) => this.onClose(event);
            this.startWebSocketPing();
            this._webSocket.onmessage = (event) => this.onMessage(event);
        }
    }
    protected onClose = (event: any) => {
        this.stopWebSocketPing();
        if (event.code !== 1001) {
            this.startConnectionRetry(WS_CONNECTION_RETRY_INTERVAL, 1);
        }
    }
    protected onError = (event: any) => {
        this.stopWebSocketPing();
        this.startConnectionRetry(WS_CONNECTION_RETRY_INTERVAL, 1);
    }
    protected onMessage = (event: any) => {
        let eventData: any = decodeBase64Uri(event.data);
        if (isJson(eventData)) {
            eventData = JSON.parse(eventData);
            switch (eventData.eventType) {
                case WS_EVENT_TYPE.PONG:
                    return;
                case WS_EVENT_TYPE.NEW_CHAT_THREAD:
                    customEvent.dispatch(LOCAL_MESSAGE_EVENT_TYPE.NEW_THREAD, event.data);
                    break;
                case WS_EVENT_TYPE.NEW_CHAT_MESSAGE:
                    customEvent.dispatch(LOCAL_MESSAGE_EVENT_TYPE.NEW_MSG, event.data);
                    // ChatManager.setMessages(event.data.threadId, event.data)
                    break;
                default:
                    break;
            }
        }
    }

}