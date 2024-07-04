import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import LessonsList from '../../components/LessonsList/LessonsList';
import LessonContent from '../../components/LessonContent/LessonContent';
import Header from '../../components/Header/Header';
import styles from './CoursePage.module.scss'; // Импортируем стили
import { Breadcrumb, Button, Card, Col, Container, Overlay, Row } from 'react-bootstrap';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import { InputGroup } from 'react-bootstrap';
import { ICourse, ILesson } from '../../types';
import UserService from '../../services/UserService';
import { CourseContentResponse } from '../../models/response/CourseContentResponse';
import Chat from '../../components/Chat/Chat';

const CoursePage: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string, lessonId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const scrollToItem = useRef<HTMLLIElement>(null)
  const [lessonsList, setLessonsList] = useState<CourseContentResponse[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<CourseContentResponse>({} as CourseContentResponse);
  const [selectedCourse, setSelectedCourse] = useState<ICourse>({} as ICourse);
  const {store, schoolStore} = useContext(Context);

  const navigate = useNavigate();

  const fetchData = async () => {
    if (courseId) {
      const selectedCourse = await UserService.getCourseById(parseInt(courseId));
      if (selectedCourse) {
        setSelectedCourse(selectedCourse.data.course);
        schoolStore.setStudentId(selectedCourse.data.attachedStudents[0].id);
        const fetchedLessons = await UserService.getCourseContent(selectedCourse.data.id)
        setLessonsList(fetchedLessons.data);

        if (fetchedLessons.data.length > 0) {
          if (lessonId) {
            setSelectedLesson(fetchedLessons.data.map((lesson, i) => lesson.id === parseInt(lessonId) ? fetchedLessons.data[i] : fetchedLessons.data[fetchedLessons.data.length-1])[0]); // Выбираем первый урок
          } else {
            setSelectedLesson(fetchedLessons.data[fetchedLessons.data.length-1]);
          }
        }
      }
    }
  }

  useEffect(() => {
    store.setLoading(true);
    
    try {
      fetchData()
    }
    catch (e) {
      console.log(e);
    }
    finally {
      store.setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (store.isAuth) {
      const sessionId = `courseId-${courseId}-lessonId-${lessonId}`;
      const socket = new WebSocket(process.env.WEBSOCKET_URL || 'ws://localhost:5000');
      schoolStore.setSocket(socket);
      schoolStore.setSessionId(sessionId);
      schoolStore.setUserId(store.user.id);
      schoolStore.setCustomLessonId(selectedLesson.id);
      schoolStore.setConnected(true);
      schoolStore.setUsername(`${store.user.surname} ${store.user.name} ${store.user.patronomic}`);
      socket.onopen = () => {
        socket.send(JSON.stringify({
            id: sessionId,
            username: schoolStore.username,
            userId: schoolStore.userId,
            //canvasIds: [],
            method: "connection"
        }));
      }

      if (searchParams.has("taskId")) {
        schoolStore.setScrollToTaskId(parseInt(searchParams.get("taskId") || "0"));
        schoolStore.setScrollToTaskRef(scrollToItem);
      } else {
        schoolStore.setScrollToTaskId(0);
      }
    }
  }, [selectedLesson])

  const handleSelectLesson = (lesson: CourseContentResponse) => {
    schoolStore.setConnected(false);
    schoolStore.socket?.close();
    setSelectedLesson({} as CourseContentResponse);
    setSelectedLesson(lesson);
    navigate(`/courses/${courseId}/lessons/${lesson.id}`);
    schoolStore.setConnected(true);
  }


  return (
    <>
      <Header />
      <Container style={{backgroundColor: "#fff", display: "block", paddingBottom: "0%", paddingTop: "30px", borderRadius: "30px"}}>
        <Row xs={1}>
          <Col>
            <h1 className={styles.courseTitle}>Курс {selectedCourse ? selectedCourse.title : ""}</h1>
            <Breadcrumb className={styles.breadcrumb}>
              <Breadcrumb.Item onClick={() => navigate('/')}>Главная</Breadcrumb.Item>
              <Breadcrumb.Item active>{selectedCourse ? selectedCourse.title : ""}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row xs={1}>
          <Col xs={3} md={2}>
            {lessonsList && lessonsList.length > 0 ? <LessonsList lessons={lessonsList} onLessonClick={(lesson) => handleSelectLesson(lesson) } /> : "Уроков нет"}
          </Col>
          <Col xs={8} ms={4}>
            {selectedLesson.lesson && selectedLesson.customTasks ? <LessonContent lesson={selectedLesson}/> : "Урок не выбран"}
          </Col>
          {/* <Col xs={2} md={2} className='position-relative'>
            
          </Col> */}
        </Row>
      </Container>
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
        <Chat/>
      </div>
    </>
  );
};

export default observer(CoursePage);
