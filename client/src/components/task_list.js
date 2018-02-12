import React from 'react';
import Task from './task_list_item';

const TaskList = props => {
  // passes in props or delete / complete / tasks

  function renderTaskItems() {
    const taskItems = props.tasks.map(task => {
      return (
        <Task
          onOpenTask={props.onOpenTask}
          onEditTask={props.onEditTask}
          onDeleteTask={props.onDeleteTask}
          onCompleteTask={props.onCompleteTask}
          task={task}
          key={task._id}
        />
      );
    });
    return taskItems;
  }

  function checkActiveBtn(filterName) {
    return filterName === props.activeFilter ? 'is-active' : '';
  }

  return (
    <div className="open-task-list">
      <nav className="panel">
        <p className="panel-tabs">
          <a onClick={event => props.onChangeTaskView(event)} className={checkActiveBtn('open')} id="open">
            Open
          </a>
          <a onClick={event => props.onChangeTaskView(event)} className={checkActiveBtn('closed')} id="closed">
            Closed
          </a>
          <a onClick={event => props.onChangeTaskView(event)} className={checkActiveBtn('all')} id="all">
            All
          </a>
        </p>
        {renderTaskItems()}
      </nav>
    </div>
  );
};

export default TaskList;
