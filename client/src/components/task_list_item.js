import React from 'react';
import DeleteIcon from './icon_delete';

const TaskListItem = props => {
  const type = props.task.status;

  return (
    <div>
      {type === 'Closed' ? (
        // returning closed tasks //
        <div className="panel-block">
          <div className="pull-left">
            <span className="tag is-danger">Done</span>
            <span> {props.task.task}</span>
          </div>
          <div className="pull-right">
            <a onClick={() => props.onOpenTask(props.task._id)}>
              <i className="fa fa-undo fa-lg" />
            </a>
            <DeleteIcon id={props.task._id} onDeleteTask={props.onDeleteTask} />
          </div>
        </div>
      ) : (
        // returning open tasks
        <div className="panel-block">
          <div className="pull-left">
            <span className="tag is-success">Open</span> {props.task.task}
          </div>
          <div className="pull-right">
            <a>
              <i onClick={() => props.onCompleteTask(props.task._id)} className="fa fa-check fa-lg" />
            </a>
            <DeleteIcon id={props.task._id} onDeleteTask={props.onDeleteTask} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskListItem;
