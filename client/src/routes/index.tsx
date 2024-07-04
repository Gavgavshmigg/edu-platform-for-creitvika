import React, { useContext, ReactNode, useEffect, useState } from 'react';
import { Route, Navigate, Routes, useNavigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage/LoginPage';
import { Context } from '..';
import MainPage from '../pages/MainPage/MainPage';
import CoursePage from '../pages/CoursePage/CoursePage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import { observer } from 'mobx-react-lite';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import Header from '../components/Header/Header';
import ManagerPage from '../pages/ManagerPage/ManagerPage';
import TeacherPage from '../pages/TeacherPage/TeacherPage';
import MaterialsPage from '../pages/MaterialsPage/MaterialsPage';

const MyRoutes = () => {

  const {store} = useContext(Context);
  const navigate = useNavigate();
  const [selectedPage, setSelectedpage] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      if (localStorage.getItem('accessToken')) {
        await store.checkAuth();
      }
      if (!store.isAuth) {
        navigate('/login');
      } else {
        switch (true) {
          case store.user.roles.some((r) => r.value === "ADMIN"):
            setSelectedpage(<ManagerPage/>);
            break;
          case store.user.roles.some((r) => r.value === "TEACHER"):
            setSelectedpage(<TeacherPage/>);
            break;
          case store.user.roles.some((r) => r.value === "STUDENT"):
            setSelectedpage(<MainPage/>);
            break;
        }
      }
    }
    checkAuth();
  }, [,store.isAuth]);

  if (store.isLoading) {
    return (
      <>
        <Header/>
        <div className="d-flex justify-content-center align-items-center">
          <Spinner/>
        </div>
      </>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/courses/:courseId/lessons/:lessonId" element={<CoursePage/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/profile/:userId" element={<ProfilePage/>} />
      <Route path="/materials/courses/:courseId" element={<MaterialsPage/>} />
      <Route path="*" element={selectedPage} />
    </Routes>
  );
};

export default observer(MyRoutes);
