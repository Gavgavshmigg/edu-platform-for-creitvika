import React from 'react';
import styles from './LessonsList.module.scss'; // Импортируем стили
import { ILesson } from '../../types';
import { CourseContentResponse } from '../../models/response/CourseContentResponse';

interface LessonsListProps {
  lessons: CourseContentResponse[];
  onLessonClick: (lesson: CourseContentResponse) => void;
}

const LessonsList: React.FC<LessonsListProps> = ({ lessons, onLessonClick }) => {
  return (
    <div className={styles.lessonsList}>
      <h2>Список уроков</h2>
      <ul className={styles.lessonItems}>
        {lessons.map((item) => (
          <li key={item.lesson.id} className={styles.lessonItem} onClick={() => onLessonClick(item)}>
            {item.lesson.title}{item.grade ? ` - ${item.grade}` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonsList;
