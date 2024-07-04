// CourseItem.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';  // Импортируем useNavigate
import styles from './NotesItem.module.scss';
import { IMAGE_FOLDER } from '../../store/schoolStore';
import path from 'path';
import { ICourse } from '../../types';
import { NotesResponseItem } from '../../models/response/NotesResponse';
import { Button } from 'react-bootstrap';

interface NotesItemProps {
  item: NotesResponseItem;
  deleteHandler: (noteId: number, isTeacherTask: boolean) => void;
  isTeacherTaskNote?: boolean;
}

const CourseItem: React.FC<NotesItemProps> = ({ item, deleteHandler, isTeacherTaskNote = false }) => {
  const navigate = useNavigate();  // Инициализируем useNavigate
  const handleClickStudent = () => {
    // Используем navigate для перенаправления на страницу курса
    navigate(`/courses/${item.customLesson.customCourseId}/lessons/${item.customLesson.id}?taskId=${item.task.id}`);
  };

  const handleClickDelete = () => {
    
  };

  return (
    <div className={styles.item} onClick={handleClickStudent}>
      {/* <div>
        <img src={item.course.imagePath} alt={item.course.title} />
      </div> */}
      <div className={`${styles.content} me-auto`}>
        <h3 className={styles.title}>{item.StudentNote.note}</h3>
        <h5 className={styles.subtitle}>{item.task.question}</h5>
      </div>
      <div>
        <Button onClick={(e) => {e.stopPropagation(); e.preventDefault(); deleteHandler(item.StudentNote.id, isTeacherTaskNote)}} variant='danger' className='w-10'>
            <img src={require('../../assets/clear.png')} alt="Удалить" width={20} height={20} style={{objectFit: "contain"}}/>
        </Button>
      </div>
    </div>
  );
};

export default CourseItem;
