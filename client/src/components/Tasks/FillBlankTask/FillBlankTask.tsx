import React, { useEffect, useState } from 'react'
import { ITask, FillBlankTaskBody } from '../../../types';
import { Form } from 'react-bootstrap';
import styles from './FillBlankTask.module.scss';

const FillBlankTask: React.FC<{task: ITask, onAnswerChange: (taskId: number, answer: any) => void, submitted: boolean, answer: any}> = ({task, onAnswerChange, submitted, answer}) => {
    const taskBody = task.body as FillBlankTaskBody;
  
    const [userAnswers, setUserAnswers] = useState<string[][]>(taskBody.correctAnswer.map((arr) => new Array<string>(arr.length).fill("")));
    const [isCorrect, setIsCorrect] = useState<boolean>(submitted &&
        userAnswers.every((answerArr, index) => answerArr.every((answer, i) => answer === taskBody.correctAnswer[index][i])
    ));
    const [isIncorrect, setIsIncorrect] = useState<boolean>(submitted &&
      userAnswers.some((answerArr, index) => answerArr.some((answer, i) => answer !== taskBody.correctAnswer[index][i])
    ));

    useEffect(() => {
      setIsCorrect(submitted &&
        userAnswers.every((answerArr, index) => answerArr.every((answer, i) => answer === taskBody.correctAnswer[index][i])
    ));
      setIsIncorrect(submitted &&
        userAnswers.some((answerArr, index) => answerArr.some((answer, i) => answer !== taskBody.correctAnswer[index][i])
      ));
      
    }, [submitted, userAnswers]);

    useEffect(() => {
      if (answer) {
        setUserAnswers(answer);
      } else {
        setUserAnswers(taskBody.correctAnswer.map((arr) => new Array<string>(arr.length).fill("")));
      }
    }, [answer])

    const handleInputChange = (event: React.ChangeEvent<any>, i: number, j: number) => {
      const newAnswers = [...userAnswers];
      newAnswers[i][j] = event.target.value;
      setUserAnswers(newAnswers);
      onAnswerChange(task.id, newAnswers);
    };

    const calculateWidth = (word?: string) => {
      if (!word) return "30px";
      return `${word.length * 16}px`;
    }
  
    return (
      <ol>
        {(task.body as FillBlankTaskBody).sentenses.map((sentense, index) => (
          <li className={styles.item} key={`fillBlank-${task.id}-${index}`}>
            {sentense.split('<').map((part, i) => {
              if (i === 0) return part;
              const [blankNumber, remaining] = part.split('>');
              return (
                <React.Fragment key={`fillBlank-blank-${task.id}-${index}-${i}`}>
                  <Form.Control
                    className={styles.blank}
                    type="text" 
                    id={`blank-${index}-${parseInt(blankNumber) - 1}`} 
                    name={`blank-${index}-${parseInt(blankNumber) - 1}`} 
                    onChange={(e) => handleInputChange(e, index, parseInt(blankNumber) - 1)}
                    value={userAnswers[index][parseInt(blankNumber) - 1]}
                    disabled={submitted}
                    style={{width: calculateWidth((task.body as FillBlankTaskBody).correctAnswer[index][parseInt(blankNumber) - 1])}}
                    isInvalid={isIncorrect && userAnswers[index][parseInt(blankNumber) - 1].toLowerCase() !== taskBody.correctAnswer[index][parseInt(blankNumber) - 1] || isIncorrect && !userAnswers[index][parseInt(blankNumber) - 1]}
                    isValid={isCorrect && userAnswers[index][parseInt(blankNumber) - 1].toLowerCase() === taskBody.correctAnswer[index][parseInt(blankNumber) - 1] || isIncorrect && userAnswers[index][parseInt(blankNumber) - 1].toLowerCase() === taskBody.correctAnswer[index][parseInt(blankNumber) - 1]}
                  />
                  {remaining}
                </React.Fragment>
              );
            })}
          </li>
        ))}
      </ol>
    );
  };
  
  export default FillBlankTask;