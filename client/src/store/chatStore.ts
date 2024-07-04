import { makeAutoObservable } from "mobx";

class ChatStore {
    socket: WebSocket | null = null;
    sessionId: string | null = null
    username: string = "";
    userId: number | null = null;
    isConnected: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    setSocket(socket: WebSocket) {
        this.socket = socket;
    }
    
    setSessionId(sessionId: string) {
        this.sessionId = sessionId;
    }

    setUserId(userId: number) {
        this.userId = userId;
    }

    setUsername(username: string) {
        this.username = username;
    }

    setConnected(isConnected: boolean) {
        this.isConnected = isConnected;
    }
}

export default new ChatStore();