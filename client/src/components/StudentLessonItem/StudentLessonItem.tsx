import React from 'react'
import { useNavigate } from 'react-router-dom';
import { CourseResponse } from '../../models/response/CourseResponse';
import styles from './StudentLessonItem.module.scss';
import moment from 'moment';

interface StudentLessonItemProps {
    item: CourseResponse,
    was: boolean
}

moment.locale('ru');
moment.utc();

const StudentLessonItem: React.FC<StudentLessonItemProps> = ({ item, was }) => {
    const navigate = useNavigate();  // Инициализируем useNavigate
    const handleClick = () => {
      // Используем navigate для перенаправления на страницу курса
      navigate(`/courses/${item.id}/lessons/${item.customLessons[0].lesson.id}`);
    };
  
    return (
      <div className={styles.item} onClick={handleClick}>
        <div>
          <img src={item.course.imagePath} alt={item.course.title} />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>{item.customLessons[0].lesson.title}{was ? ` - ${item.customLessons[0].grade}` : ''}</h3>
          <h5 className={styles.subtitle}>{was ? "Состоялся" : "Состоится"} {moment(item.customLessons[0].datetime).format('D MMMM YYYY')} в {moment(item.customLessons[0].datetime).format('HH:mm')}</h5>
        </div>
      </div>
    );
}

export default StudentLessonItem