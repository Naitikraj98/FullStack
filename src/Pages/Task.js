import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const username = localStorage.getItem('username');

    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tasks', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {

                const response = await axios.put(`http://localhost:5000/api/tasks/${currentTaskId}`, formData, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setTasks(tasks.map(task => (task._id === currentTaskId ? response.data : task)));
            } else {

                const response = await axios.post('http://localhost:5000/api/tasks', { ...formData, completed: false }, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setTasks([...tasks, response.data]);
            }

            setFormData({ title: '', description: '' });
            setIsEditing(false);
            setCurrentTaskId(null);
        } catch (error) {
            console.error('Error saving task:', error);
        }
    };

    const handleEdit = (task) => {
        setFormData({ title: task.title, description: task.description });
        setIsEditing(true);
        setCurrentTaskId(task._id);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://backend-two-liard.vercel.app/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error.response?.data || error.message);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            const response = await axios.put(
                `http://localhost:5000/api/tasks/${taskId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                }
            );

            // Update the task status and completion time in the state if the update is successful
            setTasks(tasks.map(task => task._id === taskId ? { ...task, status: newStatus, completedAt: newStatus === 'completed' ? new Date() : null } : task));
            console.log(response.data.message); // 'Task status updated'
        } catch (error) {
            console.error('Error updating task status:', error.response?.data || error.message);
        }
    };


    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4 text-center">Welcome {username}</h2>
            <form className="bg-white p-6 rounded shadow-md mb-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 mb-4 w-full"
                    required
                />
                <textarea
                    name="description"
                    placeholder="Task Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="border border-gray-300 p-2 mb-4 w-full"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
                    {isEditing ? 'Update Task' : 'Add Task'}
                </button>
            </form>

            <div className="bg-white rounded shadow-md">
                <h3 className="text-lg font-bold mb-2">Tasks</h3>
                {tasks.length === 0 ? (
                    <p>No tasks available.</p>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="flex justify-between items-center p-4 border-b">
                            <div>
                                <h4 className="font-bold">{task.title}</h4>
                                <p>{task.description}</p>
                                <p className="text-gray-500 text-sm">Created At: {new Date(task.createdAt).toLocaleString()}</p>
                                <p className={`text-sm ${task.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
                                    Status: {task.status}
                                </p>
                                {task.status === 'completed' && task.completedAt && (
                                    <p className="text-gray-500 text-sm">
                                        Completed At: {new Date(task.completedAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => handleStatusUpdate(task._id, 'completed')}
                                    className={`p-2 rounded text-white ${task.status === 'completed' ? 'bg-green-400 cursor-not-allowed' : 'bg-red-500'}`}
                                    disabled={task.status === 'completed'}
                                >
                                    {task.status === 'completed' ? 'Completed' : 'Mark Completed'}
                                </button>
                            </div>


                            <div className="flex items-center">

                                <button
                                    onClick={() => handleEdit(task)}
                                    className="bg-yellow-500 text-white p-2 rounded mx-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(task._id)}
                                    className="bg-red-500 text-white p-2 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div >
        </div >
    );
};

export default Task;
