import React, { useContext, useEffect, useState } from 'react';
import styles from './LessonContent.module.scss'; // Импортируем стили
import Task from '../Tasks/Task';
import { ILesson, ITask } from '../../types';
import { Button, Form, Modal } from 'react-bootstrap';
import UserService from '../../services/UserService';
import { Context } from '../..';
import { CourseContentResponse } from '../../models/response/CourseContentResponse';

interface LessonContentProps {
  lesson: CourseContentResponse,
}

const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {

  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [show, setShow] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const {store, schoolStore} = useContext(Context);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAnswerChange = (taskId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [taskId]: answer }));
    if (schoolStore.isConnected && schoolStore.socket && schoolStore.socket.readyState === 1 && store.isAuth && store.user.roles.some((role) => role.value === "STUDENT")) {
      schoolStore.socket.send(JSON.stringify({
        id: schoolStore.sessionId,
        userId: store.user.id,
        taskId,
        answer,
        method: 'answer'
      }))
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (schoolStore.customLessonId) {
      event.preventDefault();
      setSubmitted(true);
      
      const allCorrect = await UserService.checkAnswers(lesson.customTasks, answers, schoolStore.customLessonId)

      if (allCorrect.data) {
        setResult("Все ответы верны!");
      } else {
        setResult("Некоторые ответы неверны.");
      }
      handleShow();
    }
  };

  useEffect(() => {
    setAnswers([]);
    setSubmitted(false);
    if (store.isAuth && store.user.roles.some((role) => role.value === "TEACHER")) {
      setSubmitted(true);
      (async () => {
        if (schoolStore.studentId) {
          const response = await UserService.getAnswers(lesson.id, schoolStore.studentId);
          //console.log(response.data);
          if (response.data) {
            // setAnswers()
            response.data.map((answ: any) => {answ.customLessonId === lesson.id ? handleAnswerChange(answ.taskId, ["matching", "fillBlank", "multipleChoice"].includes(answ.task.type) ? JSON.parse(answ.StudentAnswer.answer) : answ.StudentAnswer.answer.replaceAll('"', '')) : false})
          }
        }
        
      })()
    } else if (store.isAuth) {
      (async () => {
        const response = await UserService.getAnswers(lesson.id, store.user.id);
        if (response.data) {
          // setAnswers()
          response.data.map((answ: any) => {answ.customLessonId === lesson.id ? handleAnswerChange(answ.taskId, ["matching", "fillBlank", "multipleChoice"].includes(answ.task.type) ? JSON.parse(answ.StudentAnswer.answer) : answ.StudentAnswer.answer.replaceAll('"', '')) : false })
          if (response.data.length >= lesson.customTasks.filter((item) => !["slides", "board"].includes(item.task.type)).length) {
            setSubmitted(true);
          }
        }
      })()
    }
    if (schoolStore.scrollToTaskRef?.current) {
      schoolStore.scrollToTaskRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
  }, [store.isAuth, schoolStore.studentId, lesson])

  useEffect(() => {
    if (schoolStore.isConnected && schoolStore.socket) {
      schoolStore.socket.onmessage = (event: MessageEvent) => {
        let msg = JSON.parse(event.data);
        switch (msg.method) {
            case "answer":
              handleAnswerChange(msg.taskId, msg.answer);
              break;
        }
    }
    }
  }, [schoolStore.isConnected])


  return (
    <div className={styles.lessonContent}>
      <h2>{lesson.lesson.title}{lesson.grade !== null ? ` - ${lesson.grade}` : ''}</h2>
      <hr />
      <h3>Задания</h3>
      <Form onSubmit={handleSubmit}>
        <ol className={styles.list}>
          {lesson.customTasks.map((item, index) => (
            <Task key={`task-${index}`} task={item.task} customTask={item} onAnswerChange={handleAnswerChange} submitted={submitted} answer={answers[item.task.id.toString()] || null}/>
          ))}
        </ol>
        <Button disabled={submitted} className={styles.submit} variant="success" type="submit">Сдать</Button>
      </Form>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Результат</Modal.Title>
        </Modal.Header>
        <Modal.Body>{result}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LessonContent;
