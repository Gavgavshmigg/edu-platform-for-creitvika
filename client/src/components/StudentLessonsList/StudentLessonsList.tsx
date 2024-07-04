import React from 'react';
import { CourseResponse } from '../../models/response/CourseResponse';
import { Stack } from 'react-bootstrap';
import styles from './StudentLessonsList.module.scss';
import StudentLessonItem from '../StudentLessonItem/StudentLessonItem';

interface StudentLessonsListProps {
    courses: CourseResponse[];
  }

const StudentLessonsList: React.FC<StudentLessonsListProps> = ({ courses }) => {

    const filteredCourses = courses.filter((item) => new Date(item.customLessons[0].datetime) > new Date(Date.now()));
    const gradedCourses = courses.filter((item) => item.customLessons[0].grade !== null);

    return (
        <div className={styles.coursesList}>
          <h1 className={styles.courseTitle}>Мои уроки</h1>
          <Stack>
          {filteredCourses.length > 0 ? filteredCourses.map((item) => (
              <StudentLessonItem key={`course-item-${item.course.id}`} item={item} was={false}/> 
            )) : <div>Уроки ещё не назначены</div> }
          </Stack>
          {gradedCourses.length > 0 && <>
            <h1 className={styles.courseTitle}>С оценкой</h1>
            <Stack>
            {gradedCourses.map((item) => (
                <StudentLessonItem key={`course-item-${item.course.id}`} item={item} was={true}/> 
              )) }
            </Stack>
            </>}
        </div>
      );
}

export default StudentLessonsList