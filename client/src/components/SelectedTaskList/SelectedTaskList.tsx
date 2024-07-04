import { observer } from 'mobx-react-lite'
import React, { DragEvent, useContext, useState } from 'react'
import { Card, ListGroup } from 'react-bootstrap'
import { Context } from '../..'
import { ITask } from '../../types'
import styles from './SelectedTaskList.module.scss'

const SelectedTaskList: React.FC = observer(() => {

    const {materialStore} = useContext(Context);
    const [currentItem, setCurrentItem] = useState<ITask>({} as ITask);

    const onDragOverHandler = (e: any) => {
        e.preventDefault();
        e.target.style.background = 'lightgray'
    }

    const onDragLeaveHandler = (e: any) => {
        e.target.style.background = 'none' 
    }

    const onDragStartHandler = (e: any, item: ITask) => {
        setCurrentItem(item);
    }

    const onDragEndHandler = (e: any) => {
        e.target.style.background = 'none' 
    }

    const onDropHandler = (e: any, item: ITask) => {
        e.preventDefault();
        const currentIndex = materialStore.getIndexOfTask(currentItem.id);
        const dropIndex = materialStore.getIndexOfTask(item.id);
        materialStore.switchTasks(currentIndex, dropIndex);
        e.target.style.background = 'none'
    }

    return (
        <Card>
            <Card.Header>Выбранные задания</Card.Header>
                {materialStore.tasks.length > 0 ? (
                    <ListGroup numbered>
                        {materialStore.tasks.map((task) => (
                            <ListGroup.Item
                                key={`selected-${task.id}`}
                                className={styles.item}
                                draggable={true}
                                onDragOver={(e: any) => {onDragOverHandler(e)}}
                                onDragLeave={(e: any) => {onDragLeaveHandler(e)}}
                                onDragStart={(e: any) => {onDragStartHandler(e, task)}}
                                onDragEnd={(e: any) => {onDragEndHandler(e)}}
                                onDrop={(e: any) => {onDropHandler(e, task)}}
                            >
                                {task.question}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
            ) : (
                <Card.Body>Выберите задания</Card.Body>
            )}
        </Card>
    )
})

export default SelectedTaskList