// LoginForm.tsx

import React, { useContext, useState, KeyboardEvent, ChangeEvent } from 'react';
import { Context } from '../../index';
import styles from './LoginForm.module.scss';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

interface IError {
  property: string;
  message: string;
}

const LoginForm = () => {
    const [login, setLogin] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<IError[]>([]);
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const { store } = useContext(Context);
    const navigate = useNavigate();

    const handleLogin = async () => {
        store.setLoading(true)
        try {
            const response = await store.login(login, password);
            if (response) {
                const user = await UserService.getProfile();
                store.setUser(user.data);
            }
        } catch (error: any) {
            if (Array.isArray(error.response.data)) {
                const formattedErrors = error.response.data.map((errorString: string) => {
                    const [property, message] = errorString.split(' - ');
                    return { property, message };
                });
                setErrors(formattedErrors);
            } else if (typeof error.response.data.message === 'string' && error.response.data.message.includes('логин')) {
                setErrors([{ property: 'login', message: error.response.data.message }]);
            } else if (typeof error.response.data.message === 'string' && error.response.data.message.includes('пароль')) {
                setErrors([{ property: 'password', message: error.response.data.message }]);
            }
        } finally {
            store.setLoading(false);
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        if (name === 'login') {
            setLogin(value);
            // При изменении логина сбрасываем ошибку для логина
            setErrors((prev) => prev.filter((error) => error.property !== 'login'));
        }
        if (name === 'password') {
            setPassword(value);
            // При изменении пароля сбрасываем ошибку для пароля
            setErrors((prev) => prev.filter((error) => error.property !== 'password'));
        }
    }

    return (
        <form className={styles.loginForm} onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>

            <div className={styles.loginLogo}>
                <img  src={require('../../assets/logo.png')} alt="КреItвика" />
            </div>

            <h1>Вход в аккаунт</h1>
            
            <div className={styles.inputContainer}>
                <input
                    className={`${styles.input} ${touched.login && !login.trim() && styles.errorInput}`}
                    onChange={handleInputChange}
                    value={login}
                    type="text"
                    name="login"
                    placeholder='Логин'
                />
                {errors.map((error) => (
                    error.property === 'login' && (
                        <div key={error.property} className={styles.errorContainer}>
                            <p className={styles.error}>{error.message}</p>
                        </div>
                    )
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    className={`${styles.input} ${touched.password && !password.trim() && styles.errorInput}`}
                    onChange={handleInputChange}
                    value={password}
                    type="password"
                    name="password"
                    placeholder='Пароль'
                    onKeyDown={handleKeyDown}
                />
                {errors.map((error) => (
                    error.property === 'password' && (
                        <div key={error.property} className={styles.errorContainer}>
                            <p className={styles.error}>{error.message}</p>
                        </div>
                    )
                ))}
            </div>
            {errors.length > 0 && (
                <div className={styles.errorContainer}>
                    {errors.map((error, index) => (
                        (error.property !== 'login' && error.property !== 'password') && (
                            <p key={index} className={styles.error}>{error.message}</p>
                        )
                    ))}
                </div>
            )}
            <button className={styles.button} type="submit">Войти</button>
        </form>
    );
}

export default observer(LoginForm);