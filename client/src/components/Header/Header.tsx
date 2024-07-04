import React, { useContext } from 'react';
import styles from './Header.module.scss';
import { Context } from '../..';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const {store} = useContext(Context);
    const navigate = useNavigate()

    return (
        <div className='mb-3' style={{backgroundColor: "#fff"}}>
            <Container>
                <Row>
                    <Col>
                        <div className={styles.header}>
                            <a className={styles.logo} onClick={() => navigate('/')}>
                                <img src={require('../../assets/logo.png')} alt="КреItвика" />
                            </a>

                            <div className={styles.profile}>
                                <img src={store.user.imagePath ? `${process.env.MEDIA_URL}/${store.user.imagePath}` : 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='} style={{borderRadius: '50%'}} alt="Профиль" />
                                <div className={styles['profile-menu']}>
                                    <ul>
                                        <li><a onClick={() => navigate('/profile')}>Профиль</a></li>
                                        <li><a onClick={() => navigate('/settings')}>Настройки</a></li>
                                        <li><a onClick={() => store.logout()}>Выйти</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            
        </div>
  )
}

export default Header
