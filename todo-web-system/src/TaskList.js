import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskEdit from './TaskEdit';
import TaskCreation from './TaskCreation';
import './TaskList.css';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [completionFilter, setCompletionFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks', {
        headers: { Authorization: token }
      });
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const handleComplete = async (taskId) => {
    try {
      const response = await axios.patch(`http://localhost:5000/tasks/${taskId}`, {
        completed: true
      }, {
        headers: { Authorization: token }
      });
      if (response.status === 200) {
        setTasks(tasks.map(task => task._id === taskId ? { ...task, completed: true } : task));
      }
    } catch (err) {
      setError('Failed to mark task as completed. Please try again.');
    }
  };

  const handleTaskUpdated = () => {
    setSelectedTaskId(null);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task => {
    const priorityMatch = priorityFilter === 'All' || task.priority === priorityFilter;
    const completionMatch = completionFilter === 'All' || (completionFilter === 'Completed' ? task.completed : !task.completed);
    const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return priorityMatch && completionMatch && searchMatch;
  });

  return (
    <div className="task-list-container">
      <h2>Task List</h2>
      {error && <p className="error">{error}</p>}
      <div className="filter-container">
        <label htmlFor="priorityFilter">Filter by Priority:</label>
        <select id="priorityFilter" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <label htmlFor="completionFilter">Filter by Completion:</label>
        <select id="completionFilter" value={completionFilter} onChange={(e) => setCompletionFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
        <label htmlFor="searchQuery">Search:</label>
        <input
          type="text"
          id="searchQuery"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or description"
        />
      </div>
      <TaskCreation fetchTasks={fetchTasks} token={token} />
      {selectedTaskId ? (
        <TaskEdit taskId={selectedTaskId} onTaskUpdated={handleTaskUpdated} token={token} />
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task._id} className={task.completed ? 'completed' : ''}>
              <span>{task.title}</span>
              <span>{task.description}</span>
              <span>{task.priority}</span>
              <span>{task.dueDate}</span>
              <button onClick={() => handleComplete(task._id)} disabled={task.completed}>
                {task.completed ? 'Completed' : 'Mark as Complete'}
              </button>
              <button onClick={() => setSelectedTaskId(task._id)}>Edit</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
