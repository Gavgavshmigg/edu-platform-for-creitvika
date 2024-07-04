import React, { useEffect, useState } from 'react'
import { ComboboxTaskBody, ITask } from '../../../types';
import styles from './ComboboxTask.module.scss';
import { Form } from 'react-bootstrap';

const ComboboxTask: React.FC<{task: ITask, onAnswerChange: (taskId: number, answer: any) => void, submitted: boolean, answer: any}> = ({task, onAnswerChange, submitted, answer}) => {

  const taskBody = task.body as ComboboxTaskBody;
  const correctAnswer = taskBody.correctAnswer.split(' ');

  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(correctAnswer.length).fill(""));
  const [isCorrect, setIsCorrect] = useState<boolean>(submitted && userAnswers.join(' ') === taskBody.correctAnswer);
  const [isIncorrect, setIsIncorrect] = useState<boolean>(submitted && userAnswers.join(' ') !== taskBody.correctAnswer);

  useEffect(() => {
    setIsCorrect(submitted && userAnswers.join(' ') === taskBody.correctAnswer);
    setIsIncorrect(submitted && userAnswers.join(' ') !== taskBody.correctAnswer);
  }, [submitted, userAnswers]);

  useEffect(() => {
    if (answer) {
      setUserAnswers(answer.split(' '));
    }
  }, [answer]);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = event.target.value;
    setUserAnswers(newAnswers);
    onAnswerChange(task.id, newAnswers.join(' '));
  };

  

  return (
    <div>
      <div className={styles.sentense}>
        {taskBody.words.map((words, index) => (
            <Form.Select
              name={`combobox-${task.id}-${index}`}
              value={userAnswers[index] || "default"}
              key={`combobox-${task.id}-${index}`}
              onChange={(e) => handleSelectChange(e, index)}
              disabled={submitted}
              isInvalid={isIncorrect && correctAnswer[index] !== userAnswers[index]}
              isValid={isCorrect && correctAnswer[index] === userAnswers[index] || isIncorrect && correctAnswer[index] === userAnswers[index]}
              >
                <option value="default" disabled hidden></option>
                {words.map((word, index) => (
                    <option key={`combobox-option-${task.id}-${index}`} value={word}>{word}</option>
                ))}
            </Form.Select>
        ))}
      </div>
      </div>
  )
}

export default ComboboxTask