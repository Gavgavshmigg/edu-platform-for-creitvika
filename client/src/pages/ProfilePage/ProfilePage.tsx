import { observer } from 'mobx-react-lite';
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import Header from '../../components/Header/Header';
import { Col, Container, Image, Row, Stack, Form, Button, Breadcrumb, Toast, ToastContainer, Modal } from 'react-bootstrap';
import UserService from '../../services/UserService';
import { IUser } from '../../models/IUser';
import { useNavigate, useParams } from 'react-router-dom';
import { Context } from '../..';
import { ICourse } from '../../types';

interface AttachModalProps {
  show: boolean;
  setShow: (show: boolean) => void;
  handleSubmit: (e: any, userId: number, courseId: number) => void;
  users: IUser[];
  courses: ICourse[];
  isTeacher: boolean;
}

const AttachModal: React.FC<AttachModalProps> = ({show, setShow, users, courses, isTeacher, handleSubmit}) => {

  const [selectedUserId, setSelectedUserId] = useState<number>(0);
  const [selectedCourseId, setSelectedCourseId] = useState<number>(0);

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Прикрепить курс</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Выберите {isTeacher ? "ученика" : "учителя"}</Form.Label>
            <Form.Select value={selectedUserId} onChange={(e) => setSelectedUserId(parseInt(e.target.value))}>
              {users.map((user) => (
                <option key={`modal-user-option-${user.id}`} value={user.id}>{user.surname} {user.name} {user.patronomic}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label>Выберите курс</Form.Label>
            <Form.Select value={selectedCourseId} onChange={(e) => setSelectedCourseId(parseInt(e.target.value))}>
              {courses.map((course) => (
                <option key={`modal-course-option-${course.id}`} value={course.id}>{course.title}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type='button' variant='danger' onClick={() => setShow(false)}>Отмена</Button>
        <Button type='button' variant='success' onClick={(e) => handleSubmit(e, selectedUserId, selectedCourseId)}>Сохранить</Button>
      </Modal.Footer>
    </Modal>
  )
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<IUser>({} as IUser);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isStudent, setIsStudent] = useState<boolean>(true);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [isNoRights, setIsNoRights] = useState<boolean>(true);
  const [isManager, setIsManager] = useState<boolean>(false);

  const {userId} = useParams();
  const {store} = useContext(Context);

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [patronomic, setPatronomic] = useState<string>("");
  const [image, setImage] = useState<File>();

  const [imagePath, setImagePath] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);

  const [users, setUsers] = useState<IUser[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);



  const handleUpload = () => {
    inputRef.current?.click();
  };

  const handleAttach = async (e: any, selectedUserId: number, selectedCourseId: number) => {
    if (selectedUserId && selectedCourseId && userId) {
      let teacherId = isTeacher ? parseInt(userId) : selectedUserId;
      let studentId = !isTeacher ? parseInt(userId) : selectedUserId;
      const response = await UserService.attachCourse(studentId, teacherId, selectedCourseId);
    }
  }

  const [currentHandler, setCurrentHandler] = useState<(e: any, selectedUserId: number, selectedCourseId: number)=>void>(handleAttach);

  const fetchData = async () => {
    const response = await UserService.getProfileById(parseInt(userId || store.user.id.toString()));
        if (response) {
          setProfile(response.data);
          setName(response.data.name);
          setSurname(response.data.surname);
          setPatronomic(response.data.patronomic);
          setIsStudent(store.user.roles.length > 0 ? store.user.roles[0].value === "STUDENT" : true);
          setIsManager(store.user.roles.length > 0 ? store.user.roles[0].value === "ADMIN" : true);
          setIsTeacher(response.data.roles.length > 0 ? response.data.roles[0].value === "TEACHER" : true);
          const condition = store.user.id !== parseInt(userId || store.user.id.toString());
          setIsNoRights(condition);
          return response.data;
        }
      return {} as IUser;
  }

  const preFetch = async () => {
    try {
      const courseResponse = await UserService.getAllCourses();
      const userResponse = await UserService.fetchUsers();
      if (courseResponse && userResponse && userId) {
        setCourses(courseResponse.data);
        setUsers(userResponse.data.filter((user) => user.id !== store.user.id && user.id !== parseInt(userId) && user.roles.some((role) => role.value === `${isTeacher ? "STUDENT" : "TEACHER"}`)));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setShow(true)
    }
  }

  useEffect(() => {
    if (store.isAuth) {
      fetchData()
    }
  }, [store.isAuth])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (name.length > 1 && surname.length > 2) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('patronomic', patronomic);
      formData.append('file', image as File);
      await UserService.updateProfile(formData);
      setShowToast(true);
      store.setUser(await fetchData());
    }
  }

  useEffect(() => {
    (async () => {
      if (imgRef.current && image) {
        //imgRef.current.src = `${()}`;
        const blob = new Blob([await image.arrayBuffer()]);
        const url = URL.createObjectURL(blob);
        imgRef.current.src = url;
      }
    })()
  }, [image])

  return (
    <div>
        <Header/>
        <Container style={{backgroundColor: "#fff", display: "block", paddingBottom: "5%", paddingTop: "30px", borderRadius: "30px"}}>
          <Row>
            <div className='d-flex flex-direction-row'>
              <div className='me-auto'>
                <h1>{!isNoRights ? "Настройки профиля" : "Профиль пользователя"}</h1>
              </div>
              {isManager && <div>
                <Button variant='success' type='button' onClick={() => {setCurrentHandler(handleAttach); preFetch()}}>Назначить курс</Button>
                <Button variant='danger' type='button'>Снять с курса</Button>
              </div>}
            </div>
            <Breadcrumb className="mb-5" style={{marginLeft: "10px"}}>
              <Breadcrumb.Item onClick={() => navigate('/')}>Главная</Breadcrumb.Item>
              <Breadcrumb.Item active>Профиль</Breadcrumb.Item>
            </Breadcrumb>
          </Row>
          <Row>
            <Col xs={4}>
              <Stack>
                <Image ref={imgRef} roundedCircle style={{objectPosition: "center"}} className="mx-auto mb-3" width={"85%"} src={profile.imagePath ? `${process.env.MEDIA_URL}/${profile.imagePath}` : 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='}/>
                {!isNoRights && <Button onClick={handleUpload} variant="secondary" className="mx-auto" style={{width: "80%"}}>Редактировать</Button>}
              </Stack>
            </Col>
            <Col xs={6}>
              <Form onSubmit={onSubmit}>
                  <Form.Control ref={inputRef} className="d-none" type="file" onChange={(e: any) => setImage(e.target.files[0])}></Form.Control>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>Имя</Form.Label>
                    <Col sm="10">
                      <Form.Control readOnly={isStudent || isNoRights} plaintext={isStudent || isNoRights} required type="text" placeholder='Введите имя' value={name} onChange={(e) => setName(e.target.value)}/>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>Фамилия</Form.Label>
                    <Col sm="10">
                      <Form.Control readOnly={isStudent || isNoRights} plaintext={isStudent || isNoRights} required type="text" placeholder='Введите фамилию' value={surname} onChange={(e) => setSurname(e.target.value)}/>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>Отчество</Form.Label>
                    <Col sm="10">
                      <Form.Control readOnly={isStudent || isNoRights} plaintext={isStudent || isNoRights} type="text" placeholder='Введите отчество' value={patronomic} onChange={(e) => setPatronomic(e.target.value)}/>
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>Пол</Form.Label>
                    <Col sm="10">
                      <Form.Control type="text" plaintext readOnly value={profile.gender}/>
                    </Col>
                  </Form.Group>
                  {profile.parentFullname &&
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Имя родителя</Form.Label>
                      <Col sm="10">
                        <Form.Control type="text" plaintext readOnly value={profile.parentFullname}/>
                      </Col>
                    </Form.Group>}
                  <hr />
                  <h2>Контакты</h2>
                  {profile.contacts && profile.contacts.map((contact) => (
                    <Form.Group as={Row} className="mb-3" key={`contact-${contact.id}`}>
                      <Form.Label column>{contact.contactType === "tel" ? "Телефон" : "Email"}</Form.Label>
                      <Col sm="10">
                        <Form.Control type="text" plaintext readOnly value={contact.contact}/>
                      </Col>
                    </Form.Group>
                  ))}
                  <hr />
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>Логин</Form.Label>
                    <Col sm="10">
                      <Form.Control type="text" plaintext readOnly value={profile.login}/>
                    </Col>
                  </Form.Group>
                  {!isNoRights && <Button type='submit'>Применить</Button>}
              </Form>
            </Col>
          </Row>
        </Container>
        <ToastContainer position="bottom-center" className="p-3" style={{ zIndex: 1 }}>
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
            <Toast.Header>
              <strong className='me-auto'>Уведомление о действии</strong>
            </Toast.Header>
            <Toast.Body>Профиль успешно изменён</Toast.Body>
          </Toast>
        </ToastContainer>
        {isManager && <AttachModal show={show} setShow={setShow} isTeacher={isTeacher} courses={courses} users={users} handleSubmit={handleAttach}/>}
    </div>
  )
}

export default observer(ProfilePage);