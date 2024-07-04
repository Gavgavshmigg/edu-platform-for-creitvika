import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import styles from './OwnTasks.module.scss';
import Task from '../Tasks/Task';
import { ITask, ITeacherTask } from '../../types';
import { Context } from '../..';
import UserService from '../../services/UserService';
import { observer } from 'mobx-react-lite';
import { Button, Modal, Form, Container } from 'react-bootstrap';


interface OwnTasksProps {
    teacherTasks: ITask[]
}

const OwnTasks: React.FC = observer(() => {

    const [teacherTasks, setTeacherTasks] = useState<ITask[]>([]);
    const {store} = useContext(Context);

    const [show, setShow] = useState<boolean>(false);
    const [taskType, setTaskType] = useState<string>("paragraph");
    const [question, setQuestion] = useState<string>("");
    const [paragraph, setParagraph] = useState<string>("");
    const [slides, setSlides] = useState<FileList>({} as FileList);
    

    useEffect(() => {
        if (store.isAuth) {
            (async () => {
                const response = await UserService.getTeacherTasks(store.user.id);
                if (response) {
                    setTeacherTasks(response.data);
                }
            })()
        }
    }, [store.isAuth])

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (question.length === 0) {
            return;
        }
        const formData = new FormData();
        formData.append("type", taskType);
        formData.append("question", question);
        try {
            if (taskType === "paragraph" && paragraph.length > 0) {
                formData.append("body", JSON.stringify({text: paragraph}));
            } else if (taskType === "slides" && slides.length > 0) {
                for (let i = 0; i < slides.length; i++) {
                    formData.append("files", slides[i]);
                }
            }
            const response = await UserService.createTeacherTask(store.user.id, formData);
            if (response) {
                setTeacherTasks((prev) => [...prev, response.data]);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setShow(false);
            setParagraph("");
            setQuestion("");
            setSlides({} as FileList);
        }
    }

    return (
        <>
            <Container>
                <div className='d-flex flex-direction-row'>
                    <div className='me-auto'>
                        <h1>Личные материалы</h1>
                    </div>
                    <div>
                        <Button type='button' variant='success' onClick={() => setShow(true)}>Создать материал</Button>
                    </div>
                </div>
                <div>
                    {teacherTasks.length > 0 ? 
                        <ol className={styles.list}>
                            {teacherTasks.map((item, index) => (
                                <Task key={`task-${index}`} task={item} onAnswerChange={() => {}} submitted={true} answer={null} isTeacherTask={true}/>
                            ))}
                        </ol>
                        :
                        <div>Создавайте ваши личные материалы к урокам</div>
                    }
                    
                </div>
            </Container>
            <Modal show={show} onHide={() => {setShow(false)}}>
                <Modal.Header>
                    <Modal.Title>Создать личные материалы</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className='mb-2'>
                            <Form.Label>Выберите тип</Form.Label>
                            <Form.Select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                                <option value={"paragraph"}>Текстовый параграф</option>
                                <option value={"slides"}>Слайды</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className='mb-2'>
                            <Form.Label>Введите заголовок</Form.Label>
                            <Form.Control type='text' value={question} onChange={(e) => setQuestion(e.target.value)}/>
                        </Form.Group>
                        {taskType === "paragraph" ?
                            <Form.Group className='mb-2'>
                                <Form.Label>Введите текст</Form.Label>
                                <Form.Control type='text' value={paragraph} onChange={(e) => setParagraph(e.target.value)}/>
                            </Form.Group>
                            :
                            <Form.Group className='mb-2'>
                                <Form.Label>Выберите изображения</Form.Label>
                                <Form.Control type='file' multiple onChange={(e: any) => setSlides(e.target.files)}/>
                            </Form.Group>
                        }
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                        <Button type='button' variant='danger' onClick={() => setShow(false)}>Отмена</Button>
                        <Button type='button' variant='success' onClick={handleSubmit}>Сохранить</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
})

export default OwnTasks;