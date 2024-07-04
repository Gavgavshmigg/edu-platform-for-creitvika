import React, { useContext, useEffect, useState } from 'react';
import styles from './MaterialContent.module.scss'; // Импортируем стили
import Task from '../Tasks/Task';
import { FillBlankTaskBody, ILesson, ITask, MatchingTaskBody, MultipleChoiceTaskBody } from '../../types';
import { Button, Form } from 'react-bootstrap';
import { Context } from '../..';
import UserService from '../../services/UserService';
import { MaterialLesson } from '../../models/response/MaterialResponse';
import { observer } from 'mobx-react-lite';

interface MaterialContentProps {
  lesson: MaterialLesson;
  isSelecting?: boolean;
}

const MaterialContent: React.FC<MaterialContentProps> = observer(({ lesson, isSelecting = false }) => {

  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const {store, materialStore} = useContext(Context);

  const handleAnswerChange = (taskId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [taskId]: answer }));
  }

  const handleSelect = (item: ITask) => {
    const index = materialStore.getIndexOfTask(item.id);
    if (index === -1) {
      materialStore.pushTask(item)
    } else {
      materialStore.popTask(index);
    }
  }

  useEffect(() => {
    if (!submitted && store.isAuth && store.user.roles.some((role) => role.value === "TEACHER")) {
      setSubmitted(true);
      lesson.tasks.map((task: ITask) => {handleAnswerChange(task.id, task.body.correctAnswer)});
    }}, [submitted]);

  return (
    <div className={styles.lessonContent}>
      <h2>{lesson.title}</h2>
      <hr />
      <h3>Задания</h3>
      <Form>
        <ol className={styles.list} >
          {!isSelecting && lesson.tasks.map((item, index) => (
            <Task key={`task-${index}`} task={item} onAnswerChange={handleAnswerChange} submitted={submitted} answer={answers[item.id.toString()] || null }/>
          ))}
          {isSelecting && lesson.tasks.map((item, index) => (
            <div key={`task-selecting-${index}`} onClick={(e) => {e.stopPropagation(); e.preventDefault(); handleSelect(item)}}>
              <Task className={`${isSelecting && materialStore.getIndexOfTask(item.id) > -1 ? styles.selected : styles.item}`} task={item} onAnswerChange={handleAnswerChange} submitted={submitted} answer={answers[item.id.toString()] || null }/>
            </div>
          ))}
        </ol>
      </Form>
      
    </div>
  );
})

export default MaterialContent;
