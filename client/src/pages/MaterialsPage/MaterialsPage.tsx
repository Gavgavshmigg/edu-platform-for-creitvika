import React, { useState, useEffect, useContext, useRef, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import styles from './MaterialsPage.module.scss'; // Импортируем стили
import { Breadcrumb, Button, Card, Col, Container, Form, ListGroup, Modal, Row, Stack, Toast, ToastContainer } from 'react-bootstrap';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import UserService from '../../services/UserService';
import MaterialContent from '../../components/MaterialContent/MaterialContent';
import { MaterialLesson, MaterialResponse } from '../../models/response/MaterialResponse';
import MaterialLessons from '../../components/MaterialLessons/MaterialLessons';
import SelectedTaskList from '../../components/SelectedTaskList/SelectedTaskList';
import { IUser } from '../../models/IUser';
import { TeacherStudentsResponse } from '../../models/response/TeacherStudentsResponse';
import moment from 'moment';

const MaterialsPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string}>();
  const [selectedLesson, setSelectedLesson] = useState<MaterialLesson>({} as MaterialLesson);
  const [selectedCourse, setSelectedCourse] = useState<MaterialResponse>({} as MaterialResponse);
  const {store, materialStore} = useContext(Context);
  const [show, setShow] = useState<boolean>(false);
  const [isSelecting, setIsSelecting] = useState<boolean>(false);
  const datetimePicker = useRef<HTMLInputElement>(null);
  const [students, setStudents] = useState<TeacherStudentsResponse[]>([]);
  const [customCourseId, setCustomCourseId] = useState<number>(0);
  const [datetime, setDatetime] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);

  const navigate = useNavigate();


  useEffect(() => {
    store.setLoading(true);
    const fetchData = async () => {
      if (courseId) {
        const selectedCourse = await UserService.getMaterials(parseInt(courseId));
        if (selectedCourse) {
          setSelectedCourse(selectedCourse.data);
  
          if (selectedCourse.data.lessons.length > 0) {
            setSelectedLesson(selectedCourse.data.lessons[0]);
          }
        }
      }
    }
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
    if (isSelecting) {
      materialStore.setLessonId(selectedLesson.id);
    }
    if (!isSelecting && materialStore.tasks.length > 0) {
      materialStore.setTasks([]);
    }
  }, [isSelecting]);

  useEffect(() => {
    if (show && courseId) {
      (async () => {
        const response = await UserService.getTeacherStudents(store.user.id);
        if (response.data) {
          setStudents(response.data.filter(student => student.attachedCourses.some((val) => val.course.id === parseInt(courseId))))
        }
      })()
    }
  }, [show]);

  const datetimeClickHandler = (e: any) => {
    if (datetimePicker.current) {
      let today = new Date().toLocaleString().split(', ');
      let date = today[0].split('.');
      let res = `${date[2]}-${date[1]}-${date[0]}T${today[1].slice(0, 5)}`;
      datetimePicker.current.min = res;
    }
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (customCourseId && datetime && materialStore.lessonId) {
      const response = await UserService.attachLesson({
        customCourseId,
        lessonId: materialStore.lessonId,
        tasks: materialStore.tasks.map((task, index) => ({taskId: task.id, order: index + 1, isTeacherTask: false})),
        order: materialStore.lessonId,
        datetime: moment(datetime).utc().format(),
      })
      setShow(false);
      setShowToast(true);
      setIsSelecting(false);
      setCustomCourseId(0);
      setDatetime("")
    }
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
              <Breadcrumb.Item onClick={() => navigate('/materials/courses')}>Каталог</Breadcrumb.Item>
              <Breadcrumb.Item active>{selectedCourse ? selectedCourse.title : ""}</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row xs={1}>
          <Col xs={3} md={2}>
            {selectedCourse.lessons && selectedCourse.lessons.length > 0 ? <MaterialLessons lessons={selectedCourse.lessons} onLessonClick={(lesson) => setSelectedLesson(lesson) } /> : "Уроков нет"}
          </Col>
          <Col xs={8} ms={4}>
            {selectedLesson && selectedLesson.tasks ? <MaterialContent lesson={selectedLesson} isSelecting={isSelecting} /> : "Урок не выбран"}
          </Col>
          <Col xs={2} md={2}>
            <Stack>
              {isSelecting && (
                <>
                  <SelectedTaskList/>
                  <Button className='w-60 mx-auto mt-2' disabled={materialStore.tasks.length === 0} variant='success' onClick={() => setShow(true)}>Прикрепить</Button>
                </>
              )}
              <Button className='w-60 mx-auto mt-2' variant={!isSelecting ? 'success' : 'danger'} onClick={() => setIsSelecting(!isSelecting)}>{!isSelecting ? "Составить урок" : "Отмена"}</Button>
            </Stack>
          </Col>
        </Row>
      </Container>
      <Modal centered show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Прикрепить урок к курсу ученика</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Ученик</Form.Label>
              <Form.Select value={customCourseId} onChange={(e) => setCustomCourseId(parseInt(e.target.value))} name="customCourseId">
                <option value={0} hidden disabled>Выберите ученика</option>
                {courseId && students.map((student) => (
                  <option key={`option-modal-${student.id}`} value={student.attachedCourses.filter(ac => ac.course.id === parseInt(courseId))[0].id}>
                    {student.surname} {student.name} {student.patronomic}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>Дата и время проведения</Form.Label>
              <Form.Control name="datetime" required onClick={datetimeClickHandler} value={datetime} onChange={(e) => setDatetime(e.target.value)} ref={datetimePicker} type="datetime-local"/>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setShow(false)}>
            Отмена
          </Button>
          <Button variant='success' onClick={onSubmit} disabled={customCourseId === 0 || datetime.length === 0}>
            Сохранить
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer position='bottom-center' className='position-fixed'>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Успешно!</strong>
          </Toast.Header>
          <Toast.Body>Вы прикрепили урок к курсу</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default observer(MaterialsPage);
