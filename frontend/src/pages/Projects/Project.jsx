import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import { useSelector } from 'react-redux';

const API = "http://127.0.0.1:8000/api/v1";

const Project = () => {
    const { projectId } = useParams();
    const { user } = useSelector((state) => state.auth);
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

    const fetchProject = async () => {
        try {
            const res = await fetch(`${API}/projects/${projectId}/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch project');
            const data = await res.json();
            setProject(data);
            setEditedProject(data);
            setIsOwner(data.owner === user?.id);
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
    }, [user, projectId]);

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
        if (window.confirm('Are you sure you want to Delete this project?')) {
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
        if (window.confirm('Are you sure you want to delete this dependency?')) {
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
        } catch (err) {
            alert(err.message);
        }
    };

    if (!project) return <div>Loading...</div>;

    return (
        <>
            <Header />
            {user ? (
                <div>
                    <button onClick={() => navigate('/projects')}>Back to Projects</button>
                    
                    <h2>Project: {project.name}</h2>
                    
                    {editMode ? (
                        <form onSubmit={handleUpdateProject}>
                            <div>
                                <input
                                    type="text"
                                    value={editedProject.name}
                                    onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>Start Date:</label>
                                <input
                                    type="date"
                                    value={editedProject.start_date}
                                    onChange={(e) => setEditedProject({ ...editedProject, start_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label>End Date:</label>
                                <input
                                    type="date"
                                    value={editedProject.end_date}
                                    onChange={(e) => setEditedProject({ ...editedProject, end_date: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    value={editedProject.description}
                                    onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <textarea
                                    value={editedProject.dependencies}
                                    onChange={(e) => setEditedProject({ ...editedProject, dependencies: e.target.value })}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={editedProject.github_link}
                                    onChange={(e) => setEditedProject({ ...editedProject, github_link: e.target.value })}
                                />
                            </div>
                            <button type="submit">Save</button>
                            <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    ) : (
                        <div>
                            <p>Start Date: {new Date(project.start_date).toLocaleDateString()}</p>
                            <p>End Date: {new Date(project.end_date).toLocaleDateString()}</p>
                            <p>Description: {project.description}</p>
                            <p>Dependencies: {project.dependencies}</p>
                            <p>GitHub: {project.github_link}</p>
                            
                            {isOwner && (
                                <div>
                                    <button onClick={() => setEditMode(true)}>Edit Project</button>
                                    <button onClick={handleDeleteProject}>Delete Project</button>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {isOwner && (
                        <div>
                            <h3>Add User to Project</h3>
                            <form onSubmit={handleAddUser}>
                                <input
                                    type="email"
                                    placeholder="User Email"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    required
                                />
                                <button type="submit">Add User</button>
                            </form>
                        </div>
                    )}
                    
                    <h3>To-Do Items</h3>
                    <form onSubmit={handleAddTodo}>
                        <input
                            type="text"
                            placeholder="Task"
                            value={newTodo.task}
                            onChange={(e) => setNewTodo({ ...newTodo, task: e.target.value })}
                            required
                        />
                        <input
                            type="date"
                            value={newTodo.date}
                            onChange={(e) => setNewTodo({ ...newTodo, date: e.target.value })}
                            required
                        />
                        <label>
                            <input
                                type="checkbox"
                                checked={newTodo.state}
                                onChange={(e) => setNewTodo({ ...newTodo, state: e.target.checked })}
                            />
                            Completed
                        </label>
                        <button type="submit">Add Todo</button>
                    </form>
                    
                    <ul>
                        {todos.map(todo => (
                            <li key={todo.id}>
                                {editingTodoId === todo.id ? (
                                    <form onSubmit={handleUpdateTodo}>
                                        <input
                                            type="text"
                                            value={editingTodo.task}
                                            onChange={(e) => setEditingTodo({ ...editingTodo, task: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="date"
                                            value={editingTodo.date}
                                            onChange={(e) => setEditingTodo({ ...editingTodo, date: e.target.value })}
                                            required
                                        />
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={editingTodo.state}
                                                onChange={(e) => setEditingTodo({ ...editingTodo, state: e.target.checked })}
                                            />
                                            Completed
                                        </label>
                                        <button type="submit">Save</button>
                                        <button type="button" onClick={() => setEditingTodoId(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <span style={{ textDecoration: todo.state ? 'line-through' : 'none' }}>
                                            {todo.task} - {new Date(todo.date).toLocaleDateString()}
                                        </span>
                                        <button onClick={() => {
                                            setEditingTodoId(todo.id);
                                            setEditingTodo(todo);
                                        }}>Edit</button>
                                        <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    <h3>Notes</h3>
                    <form onSubmit={handleAddNote}>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newNote.title}
                            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                            required
                        />
                        <textarea
                            placeholder="Content"
                            value={newNote.content}
                            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                            required
                        />
                        <button type="submit">Add Note</button>
                    </form>
                    
                    <ul>
                        {notes.map(note => (
                            <li key={note.id}>
                                {editingNoteId === note.id ? (
                                    <form onSubmit={handleUpdateNote}>
                                        <input
                                            type="text"
                                            value={editingNote.title}
                                            onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            value={editingNote.content}
                                            onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                                            required
                                        />
                                        <button type="submit">Save</button>
                                        <button type="button" onClick={() => setEditingNoteId(null)}>Cancel</button>
                                    </form>
                                ) : (
                                    <>
                                        <h4>{note.title}</h4>
                                        <p>{note.content}</p>
                                        <button onClick={() => {
                                            setEditingNoteId(note.id);
                                            setEditingNote(note);
                                        }}>Edit</button>
                                        <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    <h3>Technologies</h3>
                    {isOwner && (
                        <form onSubmit={handleAddTechnology}>
                            <input
                                type="text"
                                placeholder="Technology Name"
                                value={newTechnology}
                                onChange={(e) => setNewTechnology(e.target.value)}
                                required
                            />
                            <button type="submit">Add Technology</button>
                        </form>
                    )}
                    
                    <ul>
                        {technologies.map(tech => (
                            <li key={tech.id}>
                                {tech.name}
                                {isOwner && (
                                    <button onClick={() => handleRemoveTechnology(tech.id)}>Remove</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    
                    {isOwner && (
                        <>
                            <h3>Personal Dependencies</h3>
                            <form onSubmit={handleAddDependency}>
                                <input
                                    type="text"
                                    placeholder="Dependency Name"
                                    value={newDependency.name}
                                    onChange={(e) => setNewDependency({ ...newDependency, name: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Value"
                                    value={newDependency.value}
                                    onChange={(e) => setNewDependency({ ...newDependency, value: e.target.value })}
                                    required
                                />
                                <button type="submit">Add Dependency</button>
                            </form>
                            
                            <ul>
                                {dependencies.map(dep => (
                                    <li key={dep.id}>
                                        {editingDependencyId === dep.id ? (
                                            <form onSubmit={handleUpdateDependency}>
                                                <input
                                                    type="text"
                                                    value={editingDependency.name}
                                                    onChange={(e) => setEditingDependency({ ...editingDependency, name: e.target.value })}
                                                    required
                                                />
                                                <textarea
                                                    value={editingDependency.value}
                                                    onChange={(e) => setEditingDependency({ ...editingDependency, value: e.target.value })}
                                                    required
                                                />
                                                <button type="submit">Save</button>
                                                <button type="button" onClick={() => setEditingDependencyId(null)}>Cancel</button>
                                            </form>
                                        ) : (
                                            <>
                                                <h4>{dep.name}</h4>
                                                <p>{dep.value}</p>
                                                <button onClick={() => {
                                                    setEditingDependencyId(dep.id);
                                                    setEditingDependency(dep);
                                                }}>Edit</button>
                                                <button onClick={() => handleDeleteDependency(dep.id)}>Delete</button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                    
                    <h3>Group Chat</h3>
                    <div>
                        {messages.map(message => (
                            <div key={message.id}>
                                <strong>{message.sender_name || 'User ' + message.sender}</strong>: {message.content}
                                <small> ({new Date(message.created_at).toLocaleString()})</small>
                            </div>
                        ))}
                    </div>
                    
                    <form onSubmit={handleSendMessage}>
                        <textarea
                            placeholder="Type your message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            required
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            ) : (
                <div className="text-center  text-red-600">
                    You must be logged in to view this project!!!
                </div>
            )}
        </>
    );
};

export default Project;
