import React, { useEffect, useState } from 'react'
import { ITask, MultipleChoiceTaskBody } from '../../../types';
import { Form, Image } from 'react-bootstrap';
import styles from './MultipleChoiceTask.module.scss';

const MultipleChoiceTask: React.FC<{task: ITask, onAnswerChange: (taskId: number, answer: any) => void, submitted: boolean, answer: any}> = ({task, onAnswerChange, submitted, answer}) => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    
    const taskBody = (task.body as MultipleChoiceTaskBody);

    const [isCorrect, setIsCorrect] = useState<boolean>(submitted && selectedOptions.length === taskBody.correctAnswer.length && taskBody.correctAnswer.every((val) => selectedOptions.includes(val)));
    const [isIncorrect, setIsIncorrect] = useState<boolean>(submitted && selectedOptions.length === taskBody.correctAnswer.length && taskBody.correctAnswer.some((val) => !selectedOptions.includes(val)));
  
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSelectedOptions(prevState => 
        {
          let res = prevState.includes(value) ? prevState.filter(option => option !== value) : [...prevState, value];
          onAnswerChange(task.id, res);
          return res;
        }
      );
    };

    useEffect(() => {
      setIsCorrect(submitted && selectedOptions.length === taskBody.correctAnswer.length && taskBody.correctAnswer.every((val) => selectedOptions.includes(val)));
      setIsIncorrect(submitted && (selectedOptions.length !== taskBody.correctAnswer.length || taskBody.correctAnswer.some((val) => !selectedOptions.includes(val))));
    }, [submitted, selectedOptions]);

    useEffect(() => {
      if (answer) {
        setSelectedOptions(answer);
      }
    }, [answer]);
  
    return (
      <div className={!taskBody.isImages ? "" : styles.checkboxContainer}>
        {taskBody.options.map((option, index) => (
          <div key={`multipleChoice-${task.id}-${index}`} className={!taskBody.isImages ? "" : styles.imageContainer}>
            <Form.Check 
              type="checkbox" 
              id={`multipleChoice-${task.id}-${index}`} 
              className={styles.checkbox}
            >
              <Form.Check.Input
                type="checkbox"
                name={`multipleChoice-${task.id}-${index}`} 
                value={option}
                onChange={handleOptionChange}
                checked={selectedOptions.includes(option)}
                disabled={submitted}
                isInvalid={isIncorrect && !taskBody.correctAnswer.includes(option)}
                isValid={isCorrect && selectedOptions.includes(option) || isIncorrect && taskBody.correctAnswer.includes(option)}
              />
              <Form.Check.Label style={{opacity: 1}}>{!taskBody.isImages ? option : <Image src={option} alt={option} thumbnail className={styles.image}/>}</Form.Check.Label>
            </Form.Check>
          </div>
        ))}
      </div>
    );
  };
  
  export default MultipleChoiceTask;