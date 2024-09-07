import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskEdit = ({ taskId, onTaskUpdated, token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tasks/${taskId}`, {
          headers: { Authorization: token }
        });
        const task = response.data;
        setTitle(task.title);
        setDescription(task.description);
        setPriority(task.priority);
        setDueDate(task.dueDate);
      } catch (err) {
        setError('Failed to fetch task details. Please try again.');
      }
    };

    fetchTask();
  }, [taskId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://localhost:5000/tasks/${taskId}`, {
        title,
        description,
        priority,
        dueDate
      }, {
        headers: { Authorization: token }
      });
      if (response.status === 200) {
        setSuccess('Task updated successfully!');
        setError('');
        onTaskUpdated();
      }
    } catch (err) {
      setError('Task update failed. Please try again.');
    }
  };

  return (
    <div className="task-edit-container">
      <h2>Edit Task</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Task</button>
      </form>
    </div>
  );
};

export default TaskEdit;
