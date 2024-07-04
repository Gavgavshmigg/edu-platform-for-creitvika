export default class Tool {
    canvas: HTMLCanvasElement;
    ctx;
    socket: WebSocket;
    id: string;
    userId: number;
    constructor(canvas: HTMLCanvasElement, socket: WebSocket, id: string, userId: number) {
        this.canvas = canvas;
        this.socket = socket;
        this.id = id;
        this.userId = userId;
        this.ctx = canvas.getContext('2d');
        this.destroyEvents();
    }

    destroyEvents() {
        this.canvas.onmousemove = null;
        this.canvas.onmousedown = null;
        this.canvas.onmouseup = null;
    }
}