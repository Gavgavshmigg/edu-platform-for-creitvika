import React, { useContext, useEffect } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.scss';
import { observer } from 'mobx-react-lite';
import { Context } from '../..';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const {store} = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (store.isAuth)
      navigate('/');
  }, [,store.isAuth])

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <LoginForm/>
      </div>
    </div>
  )
}

export default observer(LoginPage);