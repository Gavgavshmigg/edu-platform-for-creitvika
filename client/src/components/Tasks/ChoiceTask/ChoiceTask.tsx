import React, { useEffect, useState } from 'react'
import { ChoiceTaskBody, ITask } from '../../../types';
import { Form, Image } from 'react-bootstrap';
import styles from './ChoiceTask.module.scss';

const ChoiceTask: React.FC<{task: ITask, onAnswerChange: (taskId: number, answer: any) => void, submitted: boolean, answer: any}> = ({task, onAnswerChange, submitted, answer}) => {
    
    const [userAnswer, setUserAnswer] = useState<string>(answer || "");

    const taskBody = (task.body as ChoiceTaskBody);

    const [isCorrect, setIsCorrect] = useState<boolean>(submitted && userAnswer === taskBody.correctAnswer);
    const [isIncorrect, setIsIncorrect] = useState<boolean>(submitted && userAnswer !== taskBody.correctAnswer);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUserAnswer(event.target.value);
      onAnswerChange(task.id, event.target.value);
    };

    useEffect(() => {
      setIsCorrect(submitted && userAnswer === taskBody.correctAnswer);
      setIsIncorrect(submitted && userAnswer !== taskBody.correctAnswer);
    }, [submitted, userAnswer]);

    useEffect(() => {
      if (answer){
        setUserAnswer(answer);
      }
    }, [answer])
  
    return (
      <div className={!taskBody.isImages ? "" : styles.checkboxContainer}>
        {taskBody.options.map((option, index) => (
          <div key={`choice-${task.id}-${index}`} className={!taskBody.isImages ? "" : styles.imageContainer}>
            <Form.Check 
              type="radio" 
              id={`choice-${task.id}-${index}`} 
              className={styles.checkbox}
            
            >
              <Form.Check.Input
                type="radio"
                name={`choice-${task.id}`} 
                value={option}
                onChange={handleOptionChange}
                checked={option === answer}
                disabled={submitted}
                isInvalid={isIncorrect && option !== taskBody.correctAnswer}
                isValid={isCorrect && option === userAnswer || isIncorrect && option !== userAnswer && option === taskBody.correctAnswer}
              />
              <Form.Check.Label style={{opacity: 1}}>{!taskBody.isImages ? option : <Image src={option} alt={option} thumbnail fluid className={`styles.image`}/>}</Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </div>
    );
  };
  
  export default ChoiceTask;