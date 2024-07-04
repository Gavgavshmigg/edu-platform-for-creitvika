import React from 'react';
import styles from './LearningItem.module.scss';
import { useNavigate } from 'react-router-dom';
import { TeacherStudentsResponse } from '../../models/response/TeacherStudentsResponse';
import { Button } from 'react-bootstrap';

interface LearningItemProps {
    student: TeacherStudentsResponse;
    courseIndex: number;
}

const LearningItem: React.FC<LearningItemProps> = ({ student, courseIndex }) => {
    const navigate = useNavigate();  // Инициализируем useNavigate
    const handleEnterClick = () => {
        // Используем navigate для перенаправления на страницу курса
        navigate(`/courses/${student.attachedCourses[courseIndex].id}/lessons/${student.attachedCourses[courseIndex].customLessons[0].id}`);
    };
    const handleProfileClick = () => {
        // Используем navigate для перенаправления на страницу курса
        navigate(`/profile/${student.id}`);
    };
    return (
        <div className={styles.item}>
            <div>
                <img src={student.imagePath ? `${process.env.MEDIA_URL}/${student.imagePath}` : 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='} alt={student.surname} />
            </div>
            <div className={styles.content}>
                <div style={{flex: 3}}>
                    <h3 className={styles.title}>{student.surname} {student.name} {student.patronomic}</h3>
                    <h5 className={styles.subtitle}>Курс {student.attachedCourses[courseIndex].course.title}</h5>
                </div>
                <div className="d-flex align-items-center justify-content-around" style={{flex: 1}}>
                    <Button onClick={handleEnterClick}>Войти в класс</Button>
                    <Button onClick={handleProfileClick}>Профиль</Button>
                </div>
            </div>
        </div>
    )
}

export default LearningItem