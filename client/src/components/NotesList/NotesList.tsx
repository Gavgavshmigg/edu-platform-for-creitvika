// CoursesList.tsx
import React from 'react';
import CourseItem from '../CourseItem/CourseItem'; // Импортируем новый компонент
import styles from './NotesList.module.scss';
import { Stack } from 'react-bootstrap';
import { ICourse } from '../../types';
import { CourseResponse } from '../../models/response/CourseResponse';
import { NotesResponse } from '../../models/response/NotesResponse';
import NotesItem from '../NotesItem/NotesItem';

interface NotesListProps {
  notes: NotesResponse;
  deleteHandler: (noteId: number, isTeacherTask: boolean) => void;
  isTeacher?: boolean;
}

const NotesList: React.FC<NotesListProps> = ({ notes, deleteHandler, isTeacher = false}) => {

  return (
    <div className={styles.coursesList}>
      <h1 className={styles.courseTitle}>Заметки</h1>
      <Stack>
      {notes.notes && notes.notes.length > 0 ? notes.notes.map((item) => (
          <NotesItem key={`note-item-${item.StudentNote.id}`} item={item} deleteHandler={deleteHandler} isTeacherTaskNote={isTeacher}/>
        )) : (
            <div>Заметок нет</div>
        )}
      </Stack>
    </div>
  );
};

export default NotesList;
