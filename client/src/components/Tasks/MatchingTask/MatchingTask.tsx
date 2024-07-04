import React, { useState, useEffect, useRef } from 'react';
import { ITask, MatchingTaskBody } from '../../../types';
import styles from './MatchingTask.module.scss';

interface Props {
  task: ITask;
  onAnswerChange: (taskId: number, answer: any) => void;
  submitted: boolean;
}

const MatchingTask: React.FC<{task: ITask, onAnswerChange: (taskId: number, answer: any) => void, submitted: boolean, answer: any}> = ({task, onAnswerChange, submitted, answer}) => {
  const taskBody = task.body as MatchingTaskBody;
  const [selectedWord, setSelectedWord] = useState<{ column: number; index: number } | null>(null);
  const [connections, setConnections] = useState<Array<number | null>[]>(answer || taskBody.correctAnswer.map((arr) => new Array<number | null>(arr.length).fill(null)));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClick = (column: number, index: number) => {
    if (submitted) return;
    if (selectedWord === null) {
      setSelectedWord({ column, index });
    } else {
      if (selectedWord.column !== column) {
        setConnections(prevConnections => {const arr = prevConnections.map((value, i) => {
            if (selectedWord.column < column && selectedWord.index === i) {
              return [selectedWord.index, index]
            } 
            else if (selectedWord.column > column && index === i) {
              return [index, selectedWord.index]
            }
            else {
              return value
            }});
            onAnswerChange(task.id, arr);
            return arr
          });
      }
      setSelectedWord(null);
    }
  };

  useEffect(() => {
    drawLines();
  }, [connections]);

  useEffect(() => {
    if (answer) {
      setConnections(answer);
    } else {
      setConnections(answer || taskBody.correctAnswer.map((arr) => new Array<number | null>(arr.length).fill(null)))
    }
  }, [answer]);

  const drawLines = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Очищаем canvas перед отрисовкой новых линий
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        connections.forEach((connection, index) => {
          if (connection[0] !== null && connection[1] !== null) {
            const position1 = getWordPosition(0, connection[0]); // Для слов из первого столбца используем правую грань
            const position2 = getWordPosition(1, connection[1]); // Для слов из второго столбца используем левую грань
            if (position1 && position2) {
                const { x: x1, y: y1 } = position1;
                const { x: x2, y: y2 } = position2;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }
          }
          
        });
      }
    }
  };
  

  const getWordPosition = (column: number, index: number) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const columnWidth = canvas.width / 2;
      const columnHeight = canvas.height / Math.max(taskBody.firstColumn.length, taskBody.secondColumn.length);
      let x, y;
      if (column === 0) {
        x = columnWidth / 2;
        y = (index + 0.5) * columnHeight;
      } else {
        x = columnWidth + columnWidth / 2;
        y = (index + 0.5) * columnHeight;
      }
      return { x, y };
    }
    return null;
  };

  const handleCanvasClick = () => {
    setSelectedWord(null);
  };

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        width={600}
        height={400}
        onClick={handleCanvasClick}
      />
      {taskBody.firstColumn.map((word, index) => (
        <div
          key={`first-${index}`}
          className={`${styles.word} ${selectedWord?.column === 0 && selectedWord.index === index ? styles.selected : ''}`}
          style={{ left: '25%', top: `${(index + 0.5) * (100 / taskBody.firstColumn.length)}%` }}
          onClick={() => handleClick(0, index)}
        >
          {word}
        </div>
      ))}
      {taskBody.secondColumn.map((word, index) => (
        <div
          key={`second-${index}`}
          className={`${styles.word} ${selectedWord?.column === 1 && selectedWord.index === index ? styles.selected : ''}`}
          style={{ left: '75%', top: `${(index + 0.5) * (100 / taskBody.secondColumn.length)}%` }}
          onClick={() => handleClick(1, index)}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

export default MatchingTask;
