import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';

const API = "http://127.0.0.1:8000/api/v1";

const Project = () => {

    //////////////////////////const//////////////////////////////////////////

    const { projectId } = useParams();
    const { user, userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedProject, setEditedProject] = useState({});

    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState({ task: '', date: '', state: false });
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editingTodo, setEditingTodo] = useState({});

    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: '', content: '' });
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [editingNote, setEditingNote] = useState({});

    const [technologies, setTechnologies] = useState([]);
    const [newTechnology, setNewTechnology] = useState('');

    const [dependencies, setDependencies] = useState([]);
    const [newDependency, setNewDependency] = useState({ name: '', value: '' });
    const [editingDependencyId, setEditingDependencyId] = useState(null);
    const [editingDependency, setEditingDependency] = useState({});

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const [newUserEmail, setNewUserEmail] = useState('');

    //////////////////////////fetch//////////////////////////////////////////

    const fetchProject = async () => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch project');
            const data = await res.json();
            setProject(data);
            setEditedProject(data);
            setIsOwner(
                (typeof data.owner === 'object' ? data.owner.id : data.owner) == (userInfo?.id || user?.id)
            );
        } catch (err) {
            alert('Error fetching project');
            navigate('/projects');
        }
    };

    const fetchTodos = async () => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/todos/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch todos');
            const data = await res.json();
            setTodos(data);
        } catch (err) {
            alert('Error fetching todos');
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/notes/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch notes');
            const data = await res.json();
            setNotes(data);
        } catch (err) {
            alert('Error fetching notes');
        }
    };

    const fetchTechnologies = async () => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/technologies/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch technologies');
            const data = await res.json();
            setTechnologies(data);
        } catch (err) {
            alert('Error fetching technologies');
        }
    };

    const fetchDependencies = async () => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/personaldependencies/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch dependencies');
            const data = await res.json();
            setDependencies(data);
        } catch (err) {
            alert('Error fetching dependencies');
        }
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/messages/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch messages');
            const data = await res.json();
            setMessages(data);
        } catch (err) {
            alert('Error fetching messages');
        }
    };

    useEffect(() => {
        if (user && projectId) {
            fetchProject();
            fetchTodos();
            fetchNotes();
            fetchTechnologies();
            fetchDependencies();
            fetchMessages();
        }
    }, [user, userInfo, projectId]);

    //////////////////////////projects//////////////////////////////////////////

    const handleUpdateProject = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/${projectId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedProject)
            });
            if (!res.ok) throw new Error('Failed to update project');
            fetchProject();
            setEditMode(false);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteProject = async () => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                const res = await fetch(`${API}/projects/${projectId}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user?.access}` }
                });
                if (!res.ok) throw new Error('Failed to delete project!');
                navigate('/projects');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    //////////////////////////to-does//////////////////////////////////////////

    const handleAddTodo = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/${projectId}/todos/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTodo)
            });
            if (!res.ok) throw new Error('Failed to add todo');
            setNewTodo({ task: '', date: '', state: false });
            fetchTodos();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateTodo = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/todos/${editingTodoId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingTodo)
            });
            if (!res.ok) throw new Error('Failed to update todo');
            setEditingTodoId(null);
            fetchTodos();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleTodoState = async (todo) => {
        try {
            await fetch(`${API}/todos/${todo.id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ state: !todo.state })
            });
            fetchTodos();
        } catch (err) {
            alert('Error updating todo state!!!');
        }
    };

    const handleDeleteTodo = async (todoId) => {
        if (window.confirm('Are you sure you want to delete this todo?')) {
            try {
                const res = await fetch(`${API}/todos/${todoId}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user?.access}` }
                });
                if (!res.ok) throw new Error('Failed to delete todo');
                fetchTodos();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    //////////////////////////notes//////////////////////////////////////////

    const handleAddNote = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/${projectId}/notes/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNote)
            });
            if (!res.ok) throw new Error('Failed to add note');
            setNewNote({ title: '', content: '' });
            fetchNotes();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateNote = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/notes/${editingNoteId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingNote)
            });
            if (!res.ok) throw new Error('Failed to update note!');
            setEditingNoteId(null);
            fetchNotes();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            try {
                const res = await fetch(`${API}/notes/${noteId}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user?.access}` }
                });
                if (!res.ok) throw new Error('Failed to delete note!!');
                fetchNotes();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    //////////////////////////technologies//////////////////////////////////////////

    const handleAddTechnology = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/${projectId}/technologies/add/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: newTechnology })
            });
            if (!res.ok) throw new Error('Failed to add technology!');
            setNewTechnology('');
            fetchTechnologies();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleRemoveTechnology = async (techId) => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/technologies/${techId}/remove/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to remove technology');
            fetchTechnologies();
        } catch (err) {
            alert(err.message);
        }
    };

    //////////////////////////dependencies//////////////////////////////////////////

    const handleAddDependency = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/${projectId}/personaldependencies/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDependency)
            });
            if (!res.ok) throw new Error('Failed to add dependency!');
            setNewDependency({ name: '', value: '' });
            fetchDependencies();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateDependency = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/personaldependencies/${editingDependencyId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingDependency)
            });
            if (!res.ok) throw new Error('Failed to update dependency!');
            setEditingDependencyId(null);
            fetchDependencies();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteDependency = async (dependencyId) => {
        if (window.confirm('Are you sure you want to Delete this dependency?')) {
            try {
                const res = await fetch(`${API}/personaldependencies/${dependencyId}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user?.access}` }
                });
                if (!res.ok) throw new Error('Failed to delete dependency!');
                fetchDependencies();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    //////////////////////////chat//////////////////////////////////////////

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/${projectId}/messages/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: newMessage })
            });
            if (!res.ok) throw new Error('Failed to send message!!');
            setNewMessage('');
            fetchMessages();
        } catch (err) {
            alert(err.message);
        }
    };

    //////////////////////////users//////////////////////////////////////////
    
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/${projectId}/add_user/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: newUserEmail })
            });
            if (!res.ok) throw new Error('Failed to add user!');
            setNewUserEmail('');
            fetchProject();
            toast.success("User added to project!");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <>
            <Header />
            {user ? (
                !project ? (
                    <Loading />
                ) : (
                <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 px-4 py-8">

                    {/* //////////////////////////underheader section////////////////////////////////////////// */}

                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/projects')}
                            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                        >
                            ← Back to Projects
                        </button>
                        <div className="flex-1 flex justify-center">
                            <h2 className="text-3xl font-bold text-white text-center"><u>Project: {project?.name}</u></h2>
                        </div>
                        <div className="w-40" />
                    </div>

                    {/* //////////////////////////info section////////////////////////////////////////// */}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-blue-700 flex flex-col gap-4">
                          
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-white mb-2">Project Info</h2>
                                {isOwner && !editMode && (
                                    <button
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        onClick={() => setEditMode(true)}
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                           
                            {editMode ? (
                                <form onSubmit={handleUpdateProject} className="flex flex-col gap-3">
                                    <input
                                        type="text"
                                        className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                        value={editedProject.name}
                                        onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                                        required
                                    />
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="text-gray-300 text-xs">Start Date</label>
                                            <input
                                                type="date"
                                                className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600 w-full"
                                                value={editedProject.start_date}
                                                onChange={(e) => setEditedProject({ ...editedProject, start_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-gray-300 text-xs">End Date</label>
                                            <input
                                                type="date"
                                                className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600 w-full"
                                                value={editedProject.end_date}
                                                onChange={(e) => setEditedProject({ ...editedProject, end_date: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <textarea
                                        className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                        value={editedProject.description}
                                        onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                                        placeholder="Description"
                                    />
                                    <textarea
                                        className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                        value={editedProject.dependencies}
                                        onChange={(e) => setEditedProject({ ...editedProject, dependencies: e.target.value })}
                                        placeholder="Dependencies"
                                    />
                                    <input
                                        type="text"
                                        className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                        value={editedProject.github_link}
                                        onChange={(e) => setEditedProject({ ...editedProject, github_link: e.target.value })}
                                        placeholder="GitHub Link"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Save</button>
                                        <button type="button" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700" onClick={() => setEditMode(false)}>Cancel</button>
                                    </div>
                                </form>

                            ) : (

                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-semibold text-blue-400">{project.name}</h3>
                                    <p className="text-gray-300">Start: <span className="font-medium">{new Date(project.start_date).toLocaleDateString()}</span></p>
                                    <p className="text-gray-300">End: <span className="font-medium">{new Date(project.end_date).toLocaleDateString()}</span></p>
                                    <p className="text-gray-300">Description: <span className="font-medium">{project.description}</span></p>
                                    <p className="text-gray-300">Dependencies: <span className="font-medium">{project.dependencies}</span></p>
                                    <p className="text-gray-300">GitHub: <a href={project.github_link} className="text-blue-400 underline" target="_blank" rel="noopener noreferrer">{project.github_link}</a></p>
                                </div>
                            )}

                            <div className="mt-4">
                                <h4 className="text-lg font-bold text-emerald-400 mb-2">Technologies</h4>
                               
                               {isOwner && (
                                    <form onSubmit={handleAddTechnology} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600 flex-1"
                                            placeholder="Technology Name"
                                            value={newTechnology}
                                            onChange={(e) => setNewTechnology(e.target.value)}
                                            required
                                        />
                                        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">Add</button>
                                    </form>
                                )}
                               
                                <ul className="flex flex-wrap gap-2">
                                    {technologies.map(tech => (
                                        <li key={tech.id} className="bg-blue-800 text-white px-3 py-1 rounded-lg flex items-center gap-2">
                                            {tech.name}
                                            {isOwner && (
                                                <button
                                                    className="ml-1 text-red-400 hover:text-red-600"
                                                    onClick={() => handleRemoveTechnology(tech.id)}
                                                    title="Remove"
                                                >✕</button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        {/* //////////////////////////members section////////////////////////////////////////// */}

                        <section className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-cyan-400 flex flex-col gap-6 items-center justify-center min-h-[220px]">
                            <h2 className="text-2xl font-bold text-cyan-300 mb-2">Project Members</h2>
                            <div className="flex flex-col items-center gap-2">

                                {isOwner ? (
                                    <>
                                        <span className="text-lg text-emerald-400 font-semibold">You are the <span className="underline">Owner</span> of this project.</span>
                                        <form onSubmit={handleAddUser} className="flex flex-col gap-2 mt-4 w-full max-w-xs">
                                            <label className="text-gray-300 text-sm">Add user by email:</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="email"
                                                    className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600 flex-1"
                                                    placeholder="User Email"
                                                    value={newUserEmail}
                                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                                    required
                                                />
                                                <button type="submit" className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">Add</button>
                                            </div>
                                        </form>
                                    </>
                                    
                                ) : (

                                    <span className="text-lg text-cyan-400 font-semibold">You are a <span className="underline">Member</span> of this project.</span>
                                )}

                            </div>
                            <div className="flex justify-center items-center w-full mt-4">
                                <div className="w-24 h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 opacity-40"></div>
                            </div>
                            <div className="flex justify-center items-center w-full">
                                <svg className="w-12 h-12 text-cyan-700 opacity-30" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 48 48">
                                    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
                                    <path d="M24 32c-6 0-10-4-10-8s4-8 10-8 10 4 10 8-4 8-10 8z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                            </div>
                        </section>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

                        {/* //////////////////////////chat section////////////////////////////////////////// */}

                        <section className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-blue-400 flex flex-col max-h-[32rem] h-[32rem]">
                           
                            <h3 className="text-xl font-bold text-blue-300 mb-4">Group Chat</h3>
                            <div
                                className="flex-1 max-h-[20rem] overflow-y-auto mb-4 flex flex-col gap-2 pr-2 scroll-smooth"
                            >
                                {messages.map(message => (
                                    <div key={message.id} className={`flex ${message.sender === (userInfo?.id || user?.id) ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`px-4 py-2 rounded-lg shadow ${message.sender === (userInfo?.id || user?.id) ? 'bg-blue-700 text-white' : 'bg-gray-800 text-gray-200'}`}>
                                            <span className="font-semibold">{message.sender_name || 'User ' + message.sender}</span>
                                            <span className="ml-2 text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</span>
                                            <div>{message.content}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <textarea
                                    className="flex-1 rounded px-3 py-2 bg-gray-800 text-white border border-gray-600 resize-none"
                                    placeholder="Type your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    required
                                    rows={2}
                                />
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Send</button>
                            </form>
                            
                        </section>

                        {/* //////////////////////////to-does section////////////////////////////////////////// */}

                        <section className="bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-emerald-400 flex flex-col max-h-[32rem] h-[32rem]">
                            <h3 className="text-xl font-bold text-emerald-300 mb-2">To-Do List</h3>
                            <form onSubmit={handleAddTodo} className="flex flex-col gap-2 mb-4">
                                <input
                                    type="text"
                                    className="rounded px-3 py-2 bg-emerald-100 text-gray-900 border border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition"
                                    placeholder="Task"
                                    value={newTodo.task}
                                    onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
                                    required
                                />
                                <input
                                    type="date"
                                    className="rounded px-3 py-2 bg-emerald-100 text-gray-900 border border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition"
                                    value={newTodo.date}
                                    onChange={(e) => setNewTodo({ ...newTodo, date: e.target.value })}
                                    required
                                />
                                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Add Todo</button>
                            </form>
                            <ul className="flex flex-col gap-2 overflow-y-auto flex-1 pr-2">
                                {todos.map(todo => (
                                    <li key={todo.id} className="flex items-center gap-3 bg-gray-800 rounded px-3 py-2">

                                        <button
                                            className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${todo.state ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500 bg-gray-700'} transition`}
                                            title={todo.state ? "Completed" : "Mark as completed"}
                                            onClick={e => {
                                                e.preventDefault();
                                                handleTodoState(todo);
                                            }}
                                        >
                                            {todo.state && (
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        {editingTodoId === todo.id ? (
                                            <form onSubmit={handleUpdateTodo} className="flex flex-col gap-2 flex-1">
                                                <input
                                                    type="text"
                                                    className="rounded px-2 py-1 bg-emerald-100 text-gray-900 border border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition"
                                                    value={editingTodo.task}
                                                    onChange={(e) => setEditingTodo({ ...editingTodo, task: e.target.value })}
                                                    required
                                                />
                                                <input
                                                    type="date"
                                                    className="rounded px-2 py-1 bg-emerald-100 text-gray-900 border border-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition"
                                                    value={editingTodo.date}
                                                    onChange={(e) => setEditingTodo({ ...editingTodo, date: e.target.value })}
                                                    required
                                                />
                                                <div className="flex gap-2">
                                                    <button type="submit" className="bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700">Save</button>
                                                    <button type="button" className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700" onClick={() => setEditingTodoId(null)}>Cancel</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <>
                                                <span
                                                    className={`flex-1 ${todo.state ? 'line-through text-gray-400' : 'text-white'} cursor-pointer`}
                                                    onClick={() => {
                                                        setEditingTodoId(todo.id);
                                                        setEditingTodo(todo);
                                                    }}
                                                >
                                                    {todo.task} - {new Date(todo.date).toLocaleDateString()}
                                                </span>
                                                <button
                                                    className="text-blue-400 hover:text-blue-600"
                                                    onClick={() => {
                                                        setEditingTodoId(todo.id);
                                                        setEditingTodo(todo);
                                                    }}
                                                >Edit</button>
                                                <button
                                                    className="text-red-400 hover:text-red-600"
                                                    onClick={() => handleDeleteTodo(todo.id)}
                                                >Delete</button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* //////////////////////////dependencies section////////////////////////////////////////// */}

                    {isOwner && (
                        <section className="mt-10 bg-gray-900 rounded-2xl shadow-xl p-6 border-emerald-400 max-w-3xl mx-auto">
                            <h3 className="text-xl font-bold text-emerald-300 mb-2">Personal Dependencies</h3>
                            <form onSubmit={handleAddDependency} className="flex flex-col gap-2 mb-4">
                                <input
                                    type="text"
                                    className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                    placeholder="Dependency Name"
                                    value={newDependency.name}
                                    onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
                                    required
                                />
                                <textarea
                                    className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                    placeholder="Value"
                                    value={newDependency.value}
                                    onChange={(e) => setNewDependency({ ...newDependency, value: e.target.value })}
                                    required
                                />
                                <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">Add Dependency</button>
                            </form>
                            <ul className="flex flex-col gap-2">
                                {dependencies.map(dep => (
                                    <li key={dep.id} className="bg-gray-800 rounded px-3 py-2">
                                       
                                        {editingDependencyId === dep.id ? (
                                            <form onSubmit={handleUpdateDependency} className="flex flex-col gap-2">
                                                <input
                                                    type="text"
                                                    className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600"
                                                    value={editingDependency.name}
                                                    onChange={(e) => setEditingDependency({ ...editingDependency, name: e.target.value })}
                                                    required
                                                />
                                                <textarea
                                                    className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600"
                                                    value={editingDependency.value}
                                                    onChange={(e) => setEditingDependency({ ...editingDependency, value: e.target.value })}
                                                    required
                                                />
                                                <div className="flex gap-2">
                                                    <button type="submit" className="bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700">Save</button>
                                                    <button type="button" className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700" onClick={() => setEditingDependencyId(null)}>Cancel</button>
                                                </div>
                                            </form>

                                        ) : (

                                            <>
                                                <h4 className="text-lg font-semibold text-emerald-200">{dep.name}</h4>
                                                <p className="text-gray-200">{dep.value}</p>
                                                <div className="flex gap-2 mt-1">
                                                    <button
                                                        className="text-blue-400 hover:text-blue-600"
                                                        onClick={() => {
                                                            setEditingDependencyId(dep.id);
                                                            setEditingDependency(dep);
                                                        }}
                                                    >Edit</button>
                                                    <button
                                                        className="text-red-400 hover:text-red-600"
                                                        onClick={() => handleDeleteDependency(dep.id)}
                                                    >Delete</button>
                                                </div>
                                            </>
                                        )}

                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}
                    
                    {isOwner && (
                        <div className="mt-12 flex justify-center">
                            <button
                                className="bg-red-700 hover:bg-red-800 text-white font-bold px-8 py-3 rounded-2xl shadow-lg transition"
                                onClick={handleDeleteProject}
                            >
                                Delete Project
                            </button>
                        </div>
                    )}

                    {/* //////////////////////////notes section////////////////////////////////////////// */}

                    <section className="mt-10 bg-gray-900 rounded-2xl shadow-xl p-6 border-2 border-blue-400 w-full max-w-7xl mx-auto flex flex-col gap-4">
                        <h3 className="text-xl font-bold text-blue-300 mb-2">Notes</h3>
                        <form onSubmit={handleAddNote} className="flex flex-col gap-2 mb-4">
                            <input
                                type="text"
                                className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                placeholder="Title"
                                value={newNote.title}
                                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                                required
                            />
                            <textarea
                                className="rounded px-3 py-2 bg-gray-800 text-white border border-gray-600"
                                placeholder="Content"
                                value={newNote.content}
                                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                                required
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Note</button>
                        </form>
                        <ul className="flex flex-col gap-2">
                            {notes.map(note => (
                                <li key={note.id} className="bg-gray-800 rounded px-3 py-2">
                                    {editingNoteId === note.id ? (
                                        <form onSubmit={handleUpdateNote} className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600"
                                                value={editingNote.title}
                                                onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                                required
                                            />
                                            <textarea
                                                className="rounded px-2 py-1 bg-gray-700 text-white border border-gray-600"
                                                value={editingNote.content}
                                                onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <button type="submit" className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">Save</button>
                                                <button type="button" className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700" onClick={() => setEditingNoteId(null)}>Cancel</button>
                                            </div>
                                        </form>
                                    ) : (
                                        <>
                                            <h4 className="text-lg font-semibold text-blue-200">{note.title}</h4>
                                            <p className="text-gray-200">{note.content}</p>
                                            <div className="flex gap-2 mt-1">
                                                <button
                                                    className="text-blue-400 hover:text-blue-600"
                                                    onClick={() => {
                                                        setEditingNoteId(note.id);
                                                        setEditingNote(note);
                                                    }}
                                                >Edit</button>
                                                <button
                                                    className="text-red-400 hover:text-red-600"
                                                    onClick={() => handleDeleteNote(note.id)}
                                                >Delete</button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </section>

                </div>
                )
            ) : (
                <div className="text-center text-red-600">
                    You must be logged in to view this project!!!
                </div>
            )}
        </>
    );
};

export default Project;