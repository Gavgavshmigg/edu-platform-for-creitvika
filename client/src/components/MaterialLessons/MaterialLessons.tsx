import React from 'react';
import styles from './MaterialLessons.module.scss'; // Импортируем стили
import { MaterialLesson } from '../../models/response/MaterialResponse';

interface MaterialLessonsProps {
  lessons: MaterialLesson[]
  onLessonClick: (lesson: MaterialLesson) => void;
}

const MaterialLessons: React.FC<MaterialLessonsProps> = ({ lessons, onLessonClick }) => {
  return (
    <div className={styles.lessonsList}>
      <h2>Список уроков</h2>
      <ul className={styles.lessonItems}>
        {lessons.map((lesson) => (
          <li key={lesson.id} className={styles.lessonItem} onClick={() => onLessonClick(lesson)}>
            {lesson.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MaterialLessons;
