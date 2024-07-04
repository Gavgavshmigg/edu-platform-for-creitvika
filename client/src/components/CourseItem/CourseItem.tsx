// CourseItem.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Импортируем useNavigate
import styles from './CourseItem.module.scss';
import { IMAGE_FOLDER } from '../../store/schoolStore';
import path from 'path';
import { ICourse } from '../../types';
import { CourseResponse } from '../../models/response/CourseResponse';

interface CourseItemProps {
  item: CourseResponse;
  isTeacher?: boolean;
}

const CourseItem: React.FC<CourseItemProps> = ({ item, isTeacher = false }) => {
  const navigate = useNavigate();  // Инициализируем useNavigate
  const handleClickStudent = () => {
    // Используем navigate для перенаправления на страницу курса
    navigate(`/courses/${item.id}/lessons/${item.customLessons[0].id}`);
  };

  const handleClickTeacher = () => {
    // Используем navigate для перенаправления на страницу курса
    navigate(`/materials/courses/${item.course.id}`);
  };

  return (
    <div className={styles.item} onClick={isTeacher ? handleClickTeacher : handleClickStudent}>
      <div>
        <img src={item.course.imagePath} alt={item.course.title} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{item.course.title}</h3>
        <h5 className={styles.subtitle}>{item.course.description}</h5>
      </div>
    </div>
  );
};

export default CourseItem;
