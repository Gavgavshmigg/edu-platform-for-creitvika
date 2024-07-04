import React, { useContext, useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Context } from '../..';
import UserService from '../../services/UserService';
import 'moment/locale/ru';
import { Button, Modal } from 'react-bootstrap';

moment.locale('ru');
moment.utc();

const localizer = momentLocalizer(moment);

interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    desc?: string;
}

const ModalShow = (props: {events: CalendarEvent, show: boolean, setShow: (show: boolean) => any}) => {
    return (
        <Modal show={props.show} onHide={() => props.setShow(false)}>
            <Modal.Header>
                <Modal.Title>
                    {props.events.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Урок <strong>{props.events.desc}</strong><br/>
                {new Date(props.events.start) > new Date() ? "начнётся" : "начался"} <strong>{moment(props.events.start).format('D MMMM YYYY')}</strong> в <strong>{moment(props.events.start).format('HH:mm')}</strong> и {new Date(props.events.end) > new Date() ? "закончится" : "закончился"} в <strong>{moment(props.events.end).format('HH:mm')}</strong><br/>
                с учеником <strong>{props.events.title}</strong>.
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={(e) => {e.preventDefault(); props.setShow(false)}} variant='success'>Ок</Button>
            </Modal.Footer>
        </Modal>
    )
}

const TeacherCalendar = () => {

    const {store} = useContext(Context);
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [show, setShow] = useState<boolean>(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    useEffect(() => {
        if (store.isAuth) {
            (async () => {
                const response = await UserService.getTeacherCalendar(store.user.id);
                if (response) {
                    setEvents(response.data.flatMap((user: any) => 
                    user.attachedCourses.flatMap((ac: any) => 
                    ac.customLessons.map((cl: any) => {let tmp = {
                        id: cl.id,
                        title: `${user.surname} ${user.name} ${user.patronomic}`,
                        start: moment.utc(cl.datetime).toDate(),
                        end: moment.utc(cl.datetime).add(1, 'hours').toDate(),
                        desc: `${ac.course.title} -> ${cl.lesson.title}`,
                        allDay: false
                    };
                    return tmp;
                }))))
                }
            })();
        }
    }, [store.isAuth]);

    return (
        <>
            <Calendar
            onSelectEvent={(event) => {
                setSelectedEvent(event);
                setShow(true);
            }}
            localizer={localizer}
            events={events}
            messages={{
                allDay: "Весь день",
                previous: "←",
                next: "→",
                today: "Сегодня",
                month: "Месяц",
                week: "Неделя",
                day: "День",
                agenda: "Повестка дня",
                date: "Дата",
                time: "Время",
                event: "Урок",
                showMore: total => `+ Еще ${total}`,
                noEventsInRange: 'Нет уроков в этом диапазоне'
              }}
            />
            {selectedEvent && <ModalShow events={selectedEvent} show={show} setShow={setShow} />}
        </>
  )
}

export default TeacherCalendar