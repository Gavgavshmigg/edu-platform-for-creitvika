import React, { useContext, useEffect, useRef, useState } from 'react'
import { ITask } from '../../types';
import ChoiceTask from './ChoiceTask/ChoiceTask';
import MultipleChoiceTask from './MultipleChoiceTask/MultipleChoiceTask';
import FillBlankTask from './FillBlankTask/FillBlankTask';
import TextTask from './TextTask/TextTask';
import ComboboxTask from './ComboboxTask/ComboboxTask';
import SlidesTask from './SlidesTask/SlidesTask';
import styles from './Task.module.scss';
import MatchingTask from './MatchingTask/MatchingTask';
import BoardTask from './BoardTask/BoardTask';
import { Button, Form, Overlay, OverlayTrigger, Popover } from 'react-bootstrap';
import { Context } from '../..';
import UserService from '../../services/UserService';
import ParagraphTask from './ParagraphTask/ParagraphTask';

interface TaskProps {
    task: ITask;
    onAnswerChange: (taskId: number, answer: any) => void;
    submitted: boolean;
    answer: any;
    className?: string;
    isTeacherTask?: boolean;
    customTask?: {
        id: number,
        order: number,
        task: ITask
    }
}

const Task: React.FC<TaskProps> = ({task, onAnswerChange, submitted, answer, className = "", isTeacherTask = false, customTask = null}) => {

    const [isHover, setIsHover] = useState<boolean>(false);
    const {store, schoolStore} = useContext(Context)
    const [show, setShow] = useState<boolean>(false);
    const [target, setTarget] = useState<any>(null);
    const noteOverlay = useRef(null);
    const [note, setNote] = useState<string>("");

    const onMouseEnterHandler = (e: any) => {
        e.preventDefault();
        if (store.user && store.user.roles.some((role) => role.value === "STUDENT")) {
            setIsHover(true);
        }
    }

    const onMouseLeaveHandler = (e: any) => {
        e.preventDefault();
        setIsHover(false);
        setShow(false);
    }

    const handleClick = async (e: any) => {
        if (!show && customTask) {
            const res = await UserService.getNote(customTask.id, isTeacherTask);
            if (res.data.note) {
                setNote(res.data.note);
            }
        }
        setShow(!show);
        setTarget(e.target);
    }

    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (customTask) {
            UserService.writeNote(note, customTask?.id, isTeacherTask);
        }
    }

    const selectTaskType = () => {
        let currentTask = customTask?.task || task;
        switch(currentTask.type) {
            case 'choice':
                return <ChoiceTask task={currentTask} onAnswerChange={onAnswerChange} submitted={submitted} answer={answer} />;
            case 'multipleChoice':
                return <MultipleChoiceTask task={currentTask} onAnswerChange={onAnswerChange} submitted={submitted} answer={answer} />;
            case 'fillBlank':
                return <FillBlankTask task={currentTask} onAnswerChange={onAnswerChange} submitted={submitted} answer={answer} />;
            case 'text':
                return <TextTask task={currentTask} onAnswerChange={onAnswerChange} submitted={submitted} answer={answer} />;
            case 'combobox':
                return <ComboboxTask task={currentTask} onAnswerChange={onAnswerChange} submitted={submitted} answer={answer} />;
            case 'matching':
                return <MatchingTask task={currentTask} onAnswerChange={onAnswerChange} submitted={submitted} answer={answer} />;
            case 'slides':
                return <SlidesTask task={currentTask}/>;
            case 'board':
                return <BoardTask task={currentTask}/>;
            case 'paragraph':
                return <ParagraphTask task={currentTask}/>;
            default:
                return null;
        }
    };

    const taskComponent = selectTaskType();

    if (taskComponent === null) return null;

    return (
        <li ref={customTask?.task.id === schoolStore.scrollToTaskId ? schoolStore.scrollToTaskRef : null} className={`${styles.taskItem} ${className}`} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
            <div ref={noteOverlay} className='d-flex flex-direction-row align-items-center'>
                <p className='d-block me-auto'>{task.question}</p>
                <Button onClick={handleClick} type='button' variant='outline-dark' style={{visibility: isHover ? 'visible' : 'hidden'}}>
                        <img src={require('../../assets/note.png')} alt="note" width={20} height={20}/>
                </Button>
                <Overlay
                    placement='right'
                    target={target}
                    container={noteOverlay}
                    show={show}
                    containerPadding={20}
                >
                    <Popover>
                            <Popover.Header as="h3">Заметка</Popover.Header>
                            <Popover.Body>
                                <Form>
                                    <Form.Group className='mb-3'>
                                        <Form.Label>Текст заметки</Form.Label>
                                        <Form.Control value={note} onChange={(e) => setNote(e.target.value)} as="textarea" rows={2} />
                                    </Form.Group>
                                    <Button onClick={onSubmit} type="button" variant='success'>Сохранить</Button>
                                </Form>
                            </Popover.Body>
                        </Popover>
                </Overlay>
            </div>
            {taskComponent}
        </li>
    );
};

export default Task;