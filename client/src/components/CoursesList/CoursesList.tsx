// CoursesList.tsx
import React from 'react';
import CourseItem from '../CourseItem/CourseItem'; // Импортируем новый компонент
import styles from './CoursesList.module.scss';
import { Stack } from 'react-bootstrap';
import { ICourse } from '../../types';
import { CourseResponse } from '../../models/response/CourseResponse';

interface CoursesListProps {
  courses: CourseResponse[];
  title?: string | null | undefined;
  isTeacher?: boolean;
}

const CoursesList: React.FC<CoursesListProps> = ({ courses, title = "Мои курсы", isTeacher = false}) => {
  return (
    <div className={styles.coursesList}>
      <h1 className={styles.courseTitle}>{title}</h1>
      <Stack>
      {courses.map((item) => (
          <CourseItem key={`course-item-${item.course.id}`} item={item} isTeacher={isTeacher}/>
        ))}
      </Stack>
    </div>
  );
};

export default CoursesList;
