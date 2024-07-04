import React, { FormEventHandler, useContext, useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Context } from '../..';
import chatStore from '../../store/chatStore';
import UserService from '../../services/UserService';
import { observer } from 'mobx-react-lite';

const Chat = observer(() => {
    const {store, schoolStore} = useContext(Context);
    const params = useParams();
    const lastMessage = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState<string>("")
    const [isOnline, setIsOnline] = useState<boolean>(false);

    useEffect(() => {
        if (chatStore.socket?.OPEN === 1) {
            chatStore.socket.close();
        }
        if (store.isAuth && !chatStore.socket || chatStore.socket?.CLOSED === 3) {
            const sessionId = `courseId-${params.courseId}-lessonId-${params.lessonId}`;
            (async () => {
                try {
                    const response = await UserService.getChatMessages(sessionId);
                    if (response) {
                        setMessages(response.data);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
            const socket = new WebSocket(process.env.WEBSOCKET_URL || 'ws://localhost:5000');
            chatStore.setUserId(store.user.id);
            chatStore.setUsername(`${store.user.surname} ${store.user.name} ${store.user.patronomic}`);
            chatStore.setSessionId(sessionId);
            chatStore.setSocket(socket);
            chatStore.setConnected(true);
            socket.onopen = () => {
                socket.send(JSON.stringify({
                    id: sessionId,
                    username: chatStore.username,
                    userId: chatStore.userId,
                    //canvasIds: [],
                    method: "connection"
                }));
            }
            socket.onmessage = (event: MessageEvent) => {
                let msg = JSON.parse(event.data);
                switch (msg.method) {
                    case "connection":
                        setIsOnline(true);
                        break;
                    case "message":
                        setMessages((prev) => [...prev, msg]);
                        break;
                    case "online":
                        setIsOnline(true);
                        break;
                    case "disconnection":
                        console.log("disconnected")
                        setIsOnline(false);
                        break;
                }
            }
        }
    }, [store.isAuth, schoolStore.customLessonId])

    useEffect(() => {
        if (lastMessage.current) {
            const scrollX = window.scrollX;
            const scrollY = window.scrollY;
            lastMessage.current.scrollIntoView({ behavior: 'smooth' });
            //window.scrollTo(scrollX, scrollY);
        }
    }, [messages]);
    

    const sendHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        if (input.length > 0 && chatStore.sessionId) {
            await UserService.sendMessage(input, chatStore.sessionId);
            let msg = {
                id: chatStore.sessionId,
                userId: store.user.id, 
                message: input, 
                user: {
                    name: store.user.name, 
                    surname: store.user.surname,
                    patronomic: store.user.patronomic, 
                    id: store.user.id
                }, 
                createdAt: new Date(Date.now()).toISOString(),
                method: 'message'
            }
            setMessages((prev) => [...prev, msg]);
            chatStore.socket?.send(JSON.stringify(msg))
            setInput("");
        }
    }

  return (
    <Card>
        <Card.Header className='d-flex justify-content-between'>
            Чат
            {isOnline ? <Badge bg="success">Онлайн</Badge> : <Badge bg="secondary">Оффлайн</Badge>}
        </Card.Header>
        <Card.Body className='overflow-auto' style={{height: 200}}>
            {messages.length > 0 ? messages.map(((item, i) => (
                    <Card.Text key={`message-${i}`} className='pd-5' ref={i === messages.length - 1 ? lastMessage : null}>
                        {`${item.user.name} : ${item.message}`}
                    </Card.Text>
                ))) : <Card.Text className='pd-5'>
                        Нет сообщений
                    </Card.Text>
            }
        </Card.Body>
        <Card.Footer>
            <Form onSubmit={sendHandler}>
                <InputGroup>
                    <Form.Control placeholder='Сообщение' value={input} onChange={(e) => setInput(e.target.value)}/>
                    <Button type='submit' variant="primary" size='sm' id="button-addon2">
                        ОК
                    </Button>
                </InputGroup>
            </Form>
        </Card.Footer>
    </Card>
  )
})

export default Chat