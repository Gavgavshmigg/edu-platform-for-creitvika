import React from 'react';
import styles from './LearningList.module.scss';
import { Stack } from 'react-bootstrap';
import LearningItem from '../LearningItem/LearningItem';
import { TeacherStudentsResponse } from '../../models/response/TeacherStudentsResponse';

interface LearningListProps {
    students: TeacherStudentsResponse[];
    title?: string | null | undefined;
  }

const LearningList: React.FC<LearningListProps> = ({ students, title = "Обучение" }) => {
    return (
        <div className={styles.coursesList}>
          <h1 className={styles.courseTitle}>{title}</h1>
          <Stack>
          {students.map((student) => { return student.attachedCourses.map((attachedCourse, index) => (
                    <LearningItem key={`course-item-${attachedCourse.id}`} student={student} courseIndex={index} />
                ))
            })}
          </Stack>
        </div>
      );
}

export default LearningList