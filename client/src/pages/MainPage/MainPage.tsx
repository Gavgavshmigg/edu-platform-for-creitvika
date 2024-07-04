import React, { useContext, useEffect, useState } from 'react';
import styles from './MainPage.module.scss';
import { Context } from '../..';
import Header from '../../components/Header/Header';
import CoursesList from '../../components/CoursesList/CoursesList';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { ICourse } from '../../types';
import UserService from '../../services/UserService';
import { CourseResponse } from '../../models/response/CourseResponse';
import StudentLessonsList from '../../components/StudentLessonsList/StudentLessonsList';
import NotesList from '../../components/NotesList/NotesList';
import { NotesResponse } from '../../models/response/NotesResponse';

const MainPage = () => {
  const {store} = useContext(Context);

  const navigate = useNavigate();
  // Состояние для отслеживания текущей выбранной кнопки
  const [selectedButton, setSelectedButton] = useState('/my-courses');
  const [courses, setCourses] = useState<CourseResponse[]>([] as CourseResponse[]);
  const [notes, setNotes] = useState<NotesResponse>({} as NotesResponse);

  // Функция для обновления выбранной кнопки
  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    navigate(buttonName);
  };

  const deleteHandle = async (noteId: number, isTeacherTask: boolean) => {
      await UserService.deleteNote(noteId, isTeacherTask);
      const notesResponse = await UserService.getNotes();
      if (notesResponse) {
        setNotes(notesResponse.data);
      }
  }

  useEffect(() => {
    navigate('/my-courses');
    if (store.user.id) {
      (async () => {
        const response = await UserService.getCourses(store.user.id);
        if (response) {
          setCourses(response.data);
        }
        const notesResponse = await UserService.getNotes();
        if (notesResponse) {
          setNotes(notesResponse.data);
        }
      })();
    }
    
  }, [store.user])

  return (
    <div className='h-100 d-block'>
      <Header />
      <Container style={{backgroundColor: "#fff", display: "block", paddingBottom: "10%", borderRadius: "30px"}}>
        <Row className='pt-4'>
          <Col>
            <button
              className={selectedButton === '/my-lessons' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/my-lessons')}
            >
              Мои уроки
            </button>
            <button
              className={selectedButton === '/my-courses' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/my-courses')}
            >
              Мои курсы
            </button>
            <button
              className={selectedButton === '/my-notes' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/my-notes')}
            >
              Мои заметки
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Routes>
              <Route path="/my-lessons" element={<div className={styles.content}><StudentLessonsList courses={courses}/></div>} />
              <Route index path="/my-courses" element={<div className={styles.content}><CoursesList courses={courses}/></div>} />
              <Route path="/my-notes" element={<div className={styles.content}><NotesList deleteHandler={deleteHandle} notes={notes} /></div>} />
              <Route path="/settings" element={<div className={styles.content}>Содержимое для Настройки</div>} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainPage;
