import React, { useContext, useEffect, useState } from 'react';
import styles from './ManagerPage.module.scss';
import { Context } from '../..';
import Header from '../../components/Header/Header';
import CoursesList from '../../components/CoursesList/CoursesList';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row, Toast, ToastContainer } from 'react-bootstrap';
import { ICourse } from '../../types';
import UserService from '../../services/UserService';
import { CourseResponse } from '../../models/response/CourseResponse';
import { IUser } from '../../models/IUser';
import AuthService from '../../services/AuthService';
import axios from 'axios';

const ManagerPage = () => {
  const {store} = useContext(Context);

  const navigate = useNavigate();
  // Состояние для отслеживания текущей выбранной кнопки
  const [selectedButton, setSelectedButton] = useState('/registrate');
  const [courses, setCourses] = useState<CourseResponse[]>([] as CourseResponse[]);
  const [users, setUsers] = useState<IUser[]>([] as IUser[]);

  const [showToast, setShowToast] = useState<boolean>(false)

  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [patronomic, setPatronomic] = useState<string>("");
  const [roleValue, setRoleValue] = useState<string>("STUDENT");
  const [login, setLogin] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [parentFullname, setParentFullname] = useState<string>("");
  const [tips, setTips] = useState<string>("");
  const [contacts, setContacts] = useState<{contact: string, contactType: string}[]>([{contact: "", contactType: "tel"}]);

  // Функция для обновления выбранной кнопки
  const handleButtonClick = (buttonName: string) => {
    setSelectedButton(buttonName);
    navigate(buttonName);
  };

  useEffect(() => {
    navigate('/registrate');
    if (store.user.id) {
      (async () => {
        const response = await UserService.getCourses(store.user.id);
        const usersList = await UserService.fetchUsers();
        if (response) {
          setCourses(response.data);
        }
        if (usersList) {
          setUsers(usersList.data);
        }
      })();
    }
    
  }, [store.user])

const onSubmitHandler = async (e: any) => {
  e.preventDefault();
  if (name.length > 1 && surname.length > 2 && gender.length > 0 && login.length > 0 && password.length > 0) {
    if (roleValue === "STUDENT" && parentFullname.length < 5 && contacts.length === 0) {
      return;
    }
    try {
      const response = await AuthService.registration(
        {
          name,
          surname,
          patronomic,
          gender,
          login,
          password,
          parentFullname,
          tips
        }, roleValue
      );
      if (response) {
        const {refreshToken, accessToken} = response.data;
        const candidateProfile = await axios.get<IUser>(`/users/profile`, {headers: {Authorization: `Bearer ${accessToken}`}});
        contacts.map((contact) => UserService.addContact(contact.contact, contact.contactType, candidateProfile.data.id));
        setShowToast(true);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

  return (
    <div className='h-100 d-block'>
      <Header />
      <Container style={{backgroundColor: "#fff", display: "block", paddingBottom: "10%", borderRadius: "30px"}}>
        <Row className='pt-4'>
          <Col>
            {/* <button
              className={selectedButton === '/attach-course' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/attach-course')}
            >
              Назначить курс
            </button> */}
            <button
              className={selectedButton === '/detach-course' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/detach-course')}
            >
              Пользователи
            </button>
            <button
              className={selectedButton === '/registrate' ? styles.selectedButton : styles.button}
              onClick={() => handleButtonClick('/registrate')}
            >
              Зарегистрировать
            </button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Routes>
              <Route path="/attach-course" element={<div className={styles.content}>Прикрепить курс</div>} />
              <Route path="/detach-course" element={<div className={styles.content}>
                <Container>
                <h1>Пользователи</h1>
                  {users.map((user) => (
                    <div className={styles.item} onClick={(e) => {navigate(`/profile/${user.id}`)}}>
                    <div>
                      <img src={user.imagePath ? `${process.env.MEDIA_URL}/${user.imagePath}` : 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='} alt={user.surname} />
                    </div>
                    <div className={styles.content}>
                      <h3 className={styles.title}>{user.surname} {user.name} {user.patronomic}</h3>
                      <h5 className={styles.subtitle}>{user.roles[0].name}</h5>
                    </div>
                  </div>
                  ))}
                </Container>
              </div>} />
              <Route index path="/registrate" element={<div className={styles.content}>
              <Container>
                <Form onSubmit={onSubmitHandler}>
                    <Form.Control className="d-none" type="file"></Form.Control>
                    <Form.Select className='mb-2' value={roleValue} onChange={(e) => setRoleValue(e.target.value)}>
                        <option value="ADMIN">Менеджер</option>
                        <option value="TEACHER">Учитель</option>
                        <option value="STUDENT">Ученик</option>
                      </Form.Select>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Имя</Form.Label>
                      <Col sm="10">
                        <Form.Control value={name} onChange={(e) => setName(e.target.value)} required type="text" placeholder='Введите имя' />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Фамилия</Form.Label>
                      <Col sm="10">
                        <Form.Control value={surname} onChange={(e) => setSurname(e.target.value)} required type="text" placeholder='Введите фамилию' />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Отчество</Form.Label>
                      <Col sm="10">
                        <Form.Control value={patronomic} onChange={(e) => setPatronomic(e.target.value)} type="text" placeholder='Введите отчество'/>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Пол</Form.Label>
                      <Col sm="10">
                        <Form.Check onChange={(e) => setGender(e.target.value)} type="radio" label="Мужской" name='gender' value={"Мужской"}/>
                        <Form.Check onChange={(e) => setGender(e.target.value)} type="radio" label="Женский" name='gender' value={"Женский"}/>
                      </Col>
                    </Form.Group>
      
                      {roleValue === "STUDENT" && <>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column>Имя родителя</Form.Label>
                        <Col sm="10">
                          <Form.Control value={parentFullname} onChange={(e) => setParentFullname(e.target.value)} type="text" placeholder='ФИО'/>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column>Примечания</Form.Label>
                        <Col sm="10">
                          <Form.Control value={tips} onChange={(e) => setTips(e.target.value)} type="text" placeholder='Особенности, замечания, пожелания'/>
                        </Col>
                      </Form.Group></>
                      
                      }

                
                    <hr />
                    <h2>Контакты</h2>
                    {contacts.map((contact, index) => (
                      <>
                        
                        <Form.Group as={Row} className="mb-3" >
                          <Form.Label column>{contact.contactType === "tel" ? "Телефон" : "Email"}</Form.Label>
                          <Col sm="10">
                            <Form.Select value={contact.contactType} onChange={(e) => setContacts((prev) => {let tmp = prev; tmp[index].contactType = e.target.value; return [...tmp]})}>
                              <option value={"tel"}>Телефон</option>
                              <option value={"email"}>Email</option>
                            </Form.Select>
                            <Form.Control type="text" placeholder={`Введите ${contact.contactType === "tel" ? 'номер телефона': 'Email'}`}/>
                          </Col>
                        </Form.Group>
                        
                      </>
                    ))}
                      <Button type='button' variant='success' onClick={(e) => {e.preventDefault(); setContacts((prev) => [...prev, {contact: "", contactType: "tel"}])}}>Добавить</Button>
                      <Button type='button' disabled={contacts.length < 2} variant='danger' onClick={(e) => {e.preventDefault(); setContacts((prev) => {prev.pop(); return [...prev]})}}>Убрать</Button>
                    <hr />
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Логин</Form.Label>
                      <Col sm="10">
                        <Form.Control value={login} onChange={(e) => setLogin(e.target.value)} required type="text" placeholder='Введите логин'/>
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Пароль</Form.Label>
                      <Col sm="10">
                        <Form.Control value={password} onChange={(e) => setPassword(e.target.value)} required type="text" placeholder='Введите пароль'/>
                      </Col>
                    </Form.Group>
                    <Button type='submit'>Применить</Button>
                </Form>
              </Container>
              </div>} />
              <Route path="/settings" element={<div className={styles.content}>Содержимое для Настройки</div>} />
            </Routes>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="bottom-center" className="p-3" style={{ zIndex: 1 }}>
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
            <Toast.Header>
              <strong className='me-auto'>Уведомление о действии</strong>
            </Toast.Header>
            <Toast.Body>Профиль успешно создан</Toast.Body>
          </Toast>
        </ToastContainer>
    </div>
  );
};

export default observer(ManagerPage);
