import React, { useContext, useEffect, useRef } from 'react';
import styles from './BoardTask.module.scss';
import { BoardTaskBody, ITask } from '../../../types';
import { observer } from 'mobx-react-lite';
import canvasStore from '../../../store/canvasStore';
import toolStore from '../../../store/toolStore';
import Brush from './tools/Brush';
import { Context } from '../../..';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BoardTask: React.FC<{task: ITask}> = observer(({task}) => {
    const canvasRef = useRef<HTMLCanvasElement>({} as HTMLCanvasElement);
    const {store} = useContext(Context);
    const params = useParams();
    const taskBody = task.body as BoardTaskBody;
    const sessionId = `courseId-${params.courseId}-lessonId-${params.lessonId}-taskId-${task.id}`;

    useEffect(() => {
        if (taskBody.background) {
            const imageUrl = `${process.env.MEDIA_URL || 'http://localhost:8001/img'}/${taskBody.background}`;
    
            axios.get(imageUrl, {responseType: 'arraybuffer'})
                .then(response => {
                    // Преобразование буфера ответа в base64
                    let base64Image = btoa(
                        new Uint8Array(response.data)
                            .reduce((data, byte) => data + String.fromCharCode(byte), '')
                    );
                    
                    // Добавление префикса данных для получения корректной строки base64 для изображения
                    canvasStore.setBackground(`data:${response.headers['content-type'].toLowerCase()};base64,${base64Image}`);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        canvasStore.setCanvas(canvasRef.current);
        let ctx = canvasRef.current.getContext('2d');
        axios.get(`${process.env.CANVAS_URL || 'http://localhost:5000'}/image?id=${sessionId}`)
            .then(response => {
                const img = new Image();
                img.src = response.data;
                img.onload = () => {
                    ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }).catch(error => {
                canvasStore.clear();
        })
        canvasStore.setUserId(store.user.id);
        canvasStore.setUsername(`${store.user.surname} ${store.user.name} ${store.user.patronomic}`);
        const socket = new WebSocket(process.env.WEBSOCKET_URL || 'ws://localhost:5000');
        canvasStore.setSocket(socket);
        canvasStore.setSessionId(sessionId);
        toolStore.setTool(new Brush(canvasRef.current, socket, sessionId, store.user.id));
        socket.onopen = () => {
            socket.send(JSON.stringify({
                id: sessionId,
                username: canvasStore.username,
                userId: canvasStore.userId,
                method: "connection"
            }));
        }
        socket.onmessage = (event: MessageEvent) => {
            let msg = JSON.parse(event.data);
            switch (msg.method) {
                case "connection":
                    break;
                case "draw":
                    drawHandler(msg);
                    break;
            }
        }
    }, []);

    const drawHandler = (msg: any) => {
        const figure = msg.figure;
        const ctx = canvasRef.current?.getContext('2d');
        switch (figure.type) {
            case "brush":
                Brush.draw(ctx, figure.x, figure.y);
                break;
            case "finish":
                ctx?.beginPath();
                break;
            case "undo":
                refreshImg(ctx);
                break;
            case "redo":
                refreshImg(ctx);
                break;
            case "clear":
                canvasStore.clear();
                break;

        }
    }
    
    const refreshImg = (ctx: any) => {
        axios.get(`${process.env.CANVAS_URL || 'http://localhost:5000'}/image?id=${sessionId}`)
                    .then(response => {
                        const img = new Image();
                        img.src = response.data;
                        img.onload = () => {
                            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                            ctx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
                    }).catch(error => {
                        canvasStore.clear();
                })
    }

    const mouseDownHandler = () => {
        canvasStore.pushToUndo(canvasRef.current.toDataURL())
        canvasStore.clearRedo();
    }

    const mouseUpHandler = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
        axios.post(`${process.env.CANVAS_URL || 'http://localhost:5000'}/image?id=${sessionId}`, {img: canvasRef.current.toDataURL()})
    }

  return (
    <div className={styles.canvas}>
        <div className={styles.toolbar}>
            <button type='button' className={styles.toolbar_btn} onClick={() => {canvasStore.undo()}}>
                <img src={require("../../../assets/undo.png")} width={25} height={25} alt='undo'/>
            </button>
            <button type='button' className={styles.toolbar_btn} onClick={() => {canvasStore.redo()}}>
                <img src={require("../../../assets/redo.png")} width={25} height={25} alt='redo'/>
            </button>
            <button type='button' className={styles.toolbar_btn} onClick={() => {canvasStore.clear(true)}}>
                <img src={require("../../../assets/clear.png")} width={25} height={25} alt='clear'/>
            </button>
        </div>
        <canvas onMouseUp={() => mouseUpHandler()} onMouseDown={() => mouseDownHandler()} ref={canvasRef} width={600} height={400}/>
    </div>
  )
})

export default BoardTask