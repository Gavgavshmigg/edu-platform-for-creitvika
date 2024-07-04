import React, { useEffect, useState } from 'react'
import { ITask, TextTaskBody } from '../../../types';
import { Form } from 'react-bootstrap';

const TextTask: React.FC<{task: ITask, onAnswerChange: (taskId: number, answer: any) => void, submitted: boolean, answer: any}> = ({task, onAnswerChange, submitted, answer}) => {
    const [userAnswer, setUserAnswer] = useState<string>("");
  
    const taskBody = task.body as TextTaskBody;

    const [isCorrect, setIsCorrect] = useState<boolean>(submitted && userAnswer === taskBody.correctAnswer);
    const [isIncorrect, setIsIncorrect] = useState<boolean>(submitted && userAnswer !== taskBody.correctAnswer);

    useEffect(() => {
      setIsCorrect(submitted && userAnswer.toLowerCase() === taskBody.correctAnswer);
      setIsIncorrect(submitted && userAnswer.toLowerCase() !== taskBody.correctAnswer);
    }, [submitted, userAnswer]);

    const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserAnswer(event.target.value);
        onAnswerChange(task.id, event.target.value);
    };

    useEffect(() => {
      if (answer) {
        setUserAnswer(answer);
      }
    }, [answer])
  
    return (
      <div>
          <div>
            <Form.Control 
              name={`text-${task.id}`}
              type="text" 
              value={userAnswer}
              onChange={handleAnswerChange}
              disabled={submitted}
              isInvalid={isIncorrect}
              isValid={isCorrect}
            />
          </div>
      </div>
    );
  };
  
  export default TextTask;