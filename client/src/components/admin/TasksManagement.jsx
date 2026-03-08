import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../shared/Sidebar';
import { CheckSquare, Plus, Trash2, Clock, Calendar } from 'lucide-react';
import api from '../../utils/api';

const TasksManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Self'
  });

  const [filter, setFilter] = useState('all'); // all, my, assigned, pending, completed

  const assignees = [
    'Self',
    'Faculty: Dr. Smith',
    'Faculty: Ms. Johnson',
    'Staff: Mr. Admin',
    'Staff: Ms. Receptionist'
  ];


  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (newTask.title && newTask.dueDate) {
      try {
        const taskData = {
          ...newTask,
          createdBy: user?.name || 'Admin', // Ensure createdBy is set
          id: undefined // Let database handle ID
        };

        await api.post('/tasks', taskData);
        await fetchTasks(); // Refresh list

        setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'pending', assignedTo: 'Self' });
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskStatus = async (id) => {
    try {
      await api.patch(`/tasks/${id}/status`);
      // Optimistic update or refetch
      const updatedTasks = tasks.map(task =>
        task.id === id
          ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
          : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar role="admin" />

      <div className="admin-main">
        <div className="admin-content">
          <div className="page-header">
            <div>
              <h1>Tasks Management</h1>
              <p className="text-secondary">Create and manage your daily tasks</p>
            </div>
          </div>

          {/* Create Task Form */}
          <div className="card glass-card">
            <div className="card-header">
              <h3><Plus size={20} /> Create New Task</h3>
            </div>
            <form onSubmit={addTask} className="task-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                  >
                    {assignees.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>

              <button type="submit" className="btn-primary">
                <Plus size={18} /> Create Task
              </button>
            </form>
          </div>

          {/* Tasks List */}
          <div className="card glass-card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <h3><CheckSquare size={20} /> Tasks List</h3>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >All</button>
                  <button
                    className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                  >Pending</button>
                  <button
                    className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                  >Completed</button>
                </div>
              </div>
            </div>

            {tasks.length === 0 ? (
              <div className="empty-state">
                <CheckSquare size={48} className="empty-icon" />
                <p>No tasks created yet. Create your first task above!</p>
              </div>
            ) : (
              <div className="tasks-grid">
                {tasks
                  .filter(t => {
                    if (filter === 'all') return true;
                    if (filter === 'pending') return t.status === 'pending';
                    if (filter === 'completed') return t.status === 'completed';
                    return true;
                  })
                  .map((task) => (
                    <div key={task.id} className={`task-card ${task.status}`}>
                      <div className="task-header">
                        <div className="task-checkbox">
                          <input
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => toggleTaskStatus(task.id)}
                          />
                        </div>
                        <div className="task-info">
                          <h4 className={task.status === 'completed' ? 'completed' : ''}>
                            {task.title}
                          </h4>
                          <p>{task.description}</p>
                        </div>
                        <button
                          className="btn-delete"
                          onClick={() => deleteTask(task.id)}
                          title="Delete task"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="task-meta">
                        <span className={`priority-badge ${task.priority}`}>
                          {task.priority}
                        </span>
                        <span className="task-date">
                          <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                        {task.assignedTo && task.assignedTo !== 'Self' && (
                          <span className="assignee-badge">
                            Assigned to: {task.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
        }

        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .admin-content {
          flex: 1;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .card-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #f1f5f9;
        }

        .card-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          font-size: 1.25rem;
          color: #000000;
        }

        .task-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 600;
          color: #000000;
          font-size: 0.9rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          align-self: flex-start;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .tasks-grid {
          display: grid;
          gap: 1rem;
        }

        .task-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-left: 4px solid #6366f1;
          border-radius: 12px;
          padding: 1.25rem;
          transition: all 0.3s ease;
        }

        .task-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .task-card.completed {
          opacity: 0.7;
          border-left-color: #10b981;
        }

        .task-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .task-checkbox input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
          margin-top: 0.25rem;
        }

        .task-info {
          flex: 1;
        }

        .task-info h4 {
          font-size: 1.1rem;
          color: #000000;
          margin: 0 0 0.5rem 0;
        }

        .task-info h4.completed {
          text-decoration: line-through;
          color: #000000;
        }

        .task-info p {
          font-size: 0.9rem;
          color: #000000;
          margin: 0;
        }

        .btn-delete {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          background: #fef2f2;
        }

        .task-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .priority-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .priority-badge.low {
          background: #ffe4cc;
          color: #1e40af;
        }

        .priority-badge.medium {
          background: #fef3c7;
          color: #d97706;
        }

        .priority-badge.high {
          background: #fee2e2;
          color: #dc2626;
        }

        .task-date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #000000;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-icon {
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: #94a3b8;
          font-size: 1rem;
        }


        @media (max-width: 1024px) {
          .admin-content {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
          .new-admin-content {
            padding-top: 6.5rem;
            padding-left: 1rem;
            padding-right: 1rem;
          }
        }
        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .task-header {
            flex-direction: column;
          }
        }
        
        .filter-btn {
          background: #f1f5f9;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          color: #64748b;
          font-weight: 500;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        .filter-btn.active {
          background: #6366f1;
          color: white;
        }

        .assignee-badge {
          font-size: 0.75rem;
          background: #e0e7ff;
          color: #4338ca;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          margin-left: auto;
        }
      `}</style>
    </div>
  );
};

export default TasksManagement;
