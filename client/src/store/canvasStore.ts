import axios from "axios";
import { makeAutoObservable } from "mobx";

class CanvasStore {
    canvas: HTMLCanvasElement | null = null;
    socket: WebSocket | null = null;
    sessionId: string | null = null
    undoList: any[] = [];
    redoList: any[] = [];
    username: string = "";
    userId: number | null = null;
    background: string | null = null;
    taskIds: number[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    pushTaskId(taskId: number) {
        this.taskIds.push(taskId);
    }

    setBackground(background: string) {
        this.background = background;
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

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    pushToUndo(data: any) {
        this.undoList.push(data)
    }

    pushToRedo(data: any) {
        this.redoList.push(data)
    }

    clearRedo() {
        this.redoList = [];
    }

    undo() {
        let ctx = this.canvas?.getContext('2d');
        if (this.undoList.length > 0) {
            let dataUrl = this.undoList.pop();
            this.redoList.push(this.canvas?.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx?.clearRect(0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
                ctx?.drawImage(img, 0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
            }
            this.save(dataUrl);
        } else if (this.background) {
            let img = new Image();
            img.src = this.background;
            img.onload = () => {
                ctx?.clearRect(0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
                ctx?.drawImage(img, 0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
            }
            this.save(this.background);
        } else {
            ctx?.clearRect(0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
            this.save(this.canvas?.toDataURL());
        }
        this.socket?.send(JSON.stringify({
            method: "draw",
            id: this.sessionId,
            userId: this.userId,
            figure: {
                type: "undo"
            }
        }));
    }

    redo() {
        let ctx = this.canvas?.getContext('2d');
        if (this.redoList.length > 0) {
            let dataUrl = this.redoList.pop();
            this.undoList.push(this.canvas?.toDataURL());
            let img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                ctx?.clearRect(0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
                ctx?.drawImage(img, 0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
            }
            this.save(dataUrl)
        }
        this.socket?.send(JSON.stringify({
            method: "draw",
            id: this.sessionId,
            userId: this.userId,
            figure: {
                type: "redo"
            }
        }));
    }

    clear(sender: boolean = false) {
        let ctx = this.canvas?.getContext('2d');
        this.undoList.push(this.canvas?.toDataURL());
        if (this.background) {
            let img = new Image();
            img.src = this.background;
            img.onload = () => {
                ctx?.clearRect(0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
                ctx?.drawImage(img, 0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
            }
            this.save(this.background);
        } else {
            ctx?.clearRect(0,0, this.canvas?.width ?? 600 , this.canvas?.height ?? 400)
            this.save(this.canvas?.toDataURL())
        }
        if (sender) {
            this.socket?.send(JSON.stringify({
                method: "draw",
                id: this.sessionId,
                userId: this.userId,
                figure: {
                    type: "clear"
                }
            }));
        }
        
    }

    private save(img?: string ) {
        axios.post(`${process.env.CANVAS_URL || 'http://localhost:5000'}/image?id=${this.sessionId}`, {img})
    }
}

export default new CanvasStore();