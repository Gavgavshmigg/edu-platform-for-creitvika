import React, { useContext, useEffect, useState } from 'react';
import styles from './TeacherPage.module.scss';
import { Context } from '../..';
import Header from '../../components/Header/Header';
import CoursesList from '../../components/CoursesList/CoursesList';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Col, Container, Row } from 'react-bootstrap';
import { ICourse } from '../../types';
import UserService from '../../services/UserService';
import { CourseResponse } from '../../models/response/CourseResponse';
import { IUser } from '../../models/IUser';
import { TeacherStudentsResponse } from '../../models/response/TeacherStudentsResponse';
import LearningList from '../../components/LearningList/LearningList';
import Materials from '../../components/Materials/Materials';
import TeacherCalendar from '../../components/TeacherCalendar/TeacherCalendar';


const TeacherPage = () => {
  const {store} = useContext(Context);

  const navigate = useNavigate();
  // Состояние для отслеживания текущей выбранной кнопки
  const [selectedButton, setSelectedButton] = useState(window.location.pathname.replace('/', '') ? window.location.pathname : '/learning');
  
  const [students, setStudents] = useState<TeacherStudentsResponse[]>([] as TeacherStudentsResponse[]);

  // Функция для обновления выбранной кнопки
  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    navigate(buttonName);
  };

  useEffect(() => {
    handleButtonClick(selectedButton);
    if (store.user.id) {
      (async () => {
        const students = await UserService.getTeacherStudents(store.user.id);
        if (students) {
          setStudents(students.data);
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
              className={selectedButton === '/board' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/board')}
            >
              Расписание
            </button>
            <button
              className={selectedButton === '/learning' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/learning')}
            >
              Обучение
            </button>
            <button
              className={selectedButton.startsWith('/materials') ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/materials')}
            >
              Материалы
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Routes>
              <Route path="/board" element={<div className={styles.content} style={{height: '50vh'}}><TeacherCalendar/></div>} />
              <Route index path="/learning" element={<div className={styles.content}><LearningList students={students}/></div>} />
              <Route path="/settings" element={<div className={styles.content}>Содержимое для Настройки</div>} />
              <Route path="/*" element={<div><Materials/></div>} /> 
            </Routes>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TeacherPage;
