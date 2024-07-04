import React from 'react'
import { ITask, ParagraphTaskBody } from '../../../types'

const ParagraphTask: React.FC<{task: ITask}> = ({task}) => {

    const taskBody = task.body as ParagraphTaskBody;

    return (
        <div><p>{taskBody.text}</p></div>
    )
}

export default ParagraphTask