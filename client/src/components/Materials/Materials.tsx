import React, { useContext, useEffect, useState } from 'react';
import styles from './Materials.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { Context } from '../..';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CoursesList from '../CoursesList/CoursesList';
import { CourseResponse } from '../../models/response/CourseResponse';
import UserService from '../../services/UserService';
import OwnTasks from '../OwnTasks/OwnTasks';

const Materials = () => {

    const {store} = useContext(Context);
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState(window.location.pathname.replace('/materials', '') ? window.location.pathname : '/materials/courses');
    const [courses, setCourses] = useState<CourseResponse[]>([] as CourseResponse[]);

    const handleButtonClick = (buttonName: string) => {
        setSelectedButton(buttonName);
        navigate(buttonName);
    };

    useEffect(() => {
        handleButtonClick(selectedButton);
        if (store.user.id) {
          (async () => {
            const response = await UserService.getTeacherCourses(store.user.id);
            if (response) {
              setCourses(response.data);
            }
          })();
        }
        
    }, [])

    return (
        <Container style={{backgroundColor: "#fff", display: "block", paddingBottom: "10%", borderRadius: "30px"}}>
            <Row className='pt-4'>
            <Col>
                <button
                className={selectedButton === '/materials/courses' ? styles.selectedButton : styles.button}
                onClick={() => handleButtonClick('/materials/courses')}
                >
                Каталог
                </button>
                {/* <button
                className={selectedButton === '/materials/custom-courses' ? styles.selectedButton : styles.button}
                onClick={() => handleButtonClick('/materials/custom-courses')}
                >
                База с заданиями
                </button> */}
                <button
                className={selectedButton === '/materials/own' ? styles.selectedButton : styles.button}
                onClick={() => handleButtonClick('/materials/own')}
                >
                Личные
                </button>
            </Col>
            </Row>
            <Row>
            <Col>
                <Routes>
                    <Route index path="materials/courses" element={<div className={styles.content}><CoursesList courses={courses} title={"Каталог"} isTeacher={true}/></div>} />
                    {/* <Route path="materials/custom-courses" element={<div className={styles.content}>База с заданиями</div>} /> */}
                    <Route path="materials/own" element={<div className={styles.content}><OwnTasks/></div>} />
                </Routes>
            </Col>
            </Row>
        </Container>
    )
}

export default Materials