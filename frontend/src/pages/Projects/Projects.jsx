import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/header';
import { useSelector } from 'react-redux';

const API = "http://127.0.0.1:8000/api/v1";

const Projects = () => {
    const { user } = useSelector((state) => state.auth);
    const [projects, setProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [newProject, setNewProject] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        dependencies: '',
        github_link: ''
    });
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const res = await fetch(`${API}/projects/?search=${searchQuery}`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch projects');
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            alert('Error fetching projects');
        }
    };

    useEffect(() => {
        if (user) fetchProjects();
    }, [user, searchQuery]);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProject)
            });
            
            if (!res.ok) throw new Error('Failed to create project!');
            
            setNewProject({
                name: '',
                start_date: '',
                end_date: '',
                description: '',
                dependencies: '',
                github_link: ''
            });
            
            fetchProjects();
        } catch (err) {
            alert(err.message);
        }
    };
    

    const isSharedProject = (project) => {
        return project.shared_with && project.shared_with.length > 0;
    };

    return (
        <>
            <Header />
            {user ? (
                <div>
                    <h2>Projects</h2>
                    
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    <h3>Create New Project</h3>
                    <form onSubmit={handleCreateProject}>
                        <div>
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={newProject.name}
                                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>Start Date:</label>
                            <input
                                type="date"
                                value={newProject.start_date}
                                onChange={(e) => setNewProject({ ...newProject, start_date: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label>End Date:</label>
                            <input
                                type="date"
                                value={newProject.end_date}
                                onChange={(e) => setNewProject({ ...newProject, end_date: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Description"
                                value={newProject.description}
                                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Dependencies"
                                value={newProject.dependencies}
                                onChange={(e) => setNewProject({ ...newProject, dependencies: e.target.value })}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="GitHub Link"
                                value={newProject.github_link}
                                onChange={(e) => setNewProject({ ...newProject, github_link: e.target.value })}
                            />
                        </div>
                        <button type="submit">Create Project</button>
                    </form>
                    
                    <h3>Your Projects</h3>
                    <ul>
                        {projects.map(project => (
                            <li key={project.id}>
                                <div onClick={() => navigate(`/project/${project.id}`)}>
                                    <h4>{project.name}</h4>
                                    <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
                                    <p>Type: {isSharedProject(project) ? 'Group Project' : 'Personal Project'}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center  text-red-600">
                    You must be logged in to view your projects!!!
                </div>
            )}
        </>
    );
};

export default Projects;
