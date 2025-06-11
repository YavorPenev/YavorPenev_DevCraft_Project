import React, { use, useEffect, useState } from 'react';
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
    const [enterbutton, setEnterButton] = useState(false);
    const navigate = useNavigate();

    const setButton = (value) => {
        setEnterButton(value);
    }

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
                <div className='bg-slate-900'>
                    <h2 className='m-4 text-2xl text-white font-bold'>Projects</h2>
                    <input
                        className='border-none mr-[40%] ml-[40%] font-bold w-[20%] text-slate-200 mb-8 p-2 border rounded bg-slate-800'
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <h3>Your Projects</h3>

                    <ul className='mb-4'>
                        <div className='flex flex-row flex-wrap justify-around items-center gap-6'>
                            {projects.map(project => (
                                <li key={project.id}>
                                    <div onClick={() => navigate(`/project/${project.id}`)}
                                        className='flex bg-slate-800 border-none transition-transform hover:duration-150 hover:border-4 hover:border-slate-400 text-slate-200 flex-col items-center justify-center cursor-pointer p-4 rounded hover:bg-slate-700'>
                                        <h4 className=''>{project.name}</h4>
                                        <p className='text-3xl font-extrabold'>{isSharedProject(project) ? 'Group' : 'Personal'}</p>
                                        <p>Created: {new Date(project.created_at).toLocaleDateString()}</p>
                                    </div>
                                </li>
                            ))}

                        </div>

                    </ul>

                    <button className='mr-[45%] ml-[45%] w-[10%] aspect-square rounded-md h-15 bg-white text-blue-900 font-extrabold text-3xl' onClick={() => setButton(!enterbutton)}>
                        +
                    </button>


                    {enterbutton && (
                        <form onSubmit={handleCreateProject}
                            className='mb-4 p-4 border rounded bg-gray-100'>
                            <h3>Create New Project</h3>
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
                        )
                    }



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
