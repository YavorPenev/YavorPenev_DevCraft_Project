import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../components/header';
import { useSelector } from 'react-redux';


const API = "http://127.0.0.1:8000/api/v1";

const Projects = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddProjectPopup, setShowAddProjectPopup] = useState(false);
    const [projectForm, setProjectForm] = useState({
        name: '',
        start_date: '',
        end_date: '',
        description: '',
        dependencies: '',
        github_link: ''
    });

    const fetchProjects = async (searchValue = '') => {
        try {
            const res = await fetch(`${API}/projects/?search=${encodeURIComponent(searchValue)}`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch projects!');
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            alert('Error fetching projects!');
        }
    };

    useEffect(() => {
        if (user) fetchProjects();
    }, [user]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        fetchProjects(e.target.value);
    };

    const handleAddProject = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/projects/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectForm)
            });
            if (!res.ok) throw new Error('Failed to create project!');
            setProjectForm({
                name: '',
                start_date: '',
                end_date: '',
                description: '',
                dependencies: '',
                github_link: ''
            });
            setShowAddProjectPopup(false);
            fetchProjects();
        } catch (err) {
            alert('Error creating project');
        }
    };

    const handleSelectProject = (project) => {
        navigate(`/project/${project.id}/`);
    };

    const isSharedProject = (project) => {
        return project.shared_with && project.shared_with.length > 0;
    };

    return (
        <>
            <Header />
            {user ? (
                <div className='min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900'>
                    <div className='flex flex-row items-center'>
                        <h1 className='m-7 font-bold text-white text-2xl drop-shadow-lg'>Your Projects. Search by name:</h1>
                        <div className='flex-row flex relative'>
                            <input
                                className="bg-gray-800 h-10 text-gray-200 pl-4 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-white transition-all w-64"
                                type="text"
                                placeholder="Search by name..."
                                value={search}
                                onChange={handleSearch}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <ul className='flex flex-row flex-wrap justify-start mx-8 gap-8'>
                        {projects.map(project => (
                            <li key={project.id} className="mb-6">
                                <div
                                    className={`relative flex flex-col items-center justify-between bg-gradient-to-br from-blue-900 via-gray-800 to-blue-700 border-4 ${isSharedProject(project) ? 'border-cyan-400' : 'border-emerald-400'} rounded-2xl shadow-xl hover:scale-105 transition-transform duration-200 cursor-pointer h-53 w-53`}
                                    onClick={() => handleSelectProject(project)}
                                >
                                    <h3 className="text-xl font-bold text-white mt-4 mb-2 px-2 truncate w-full text-center drop-shadow">{project.name}</h3>
                                    <div className="flex-1 flex flex-col justify-center items-center">
                                        <span className={`text-3xl font-extrabold tracking-widest uppercase ${isSharedProject(project) ? 'text-cyan-300' : 'text-emerald-400'} drop-shadow`}>
                                            {isSharedProject(project) ? 'Group' : 'Personal'}
                                        </span>
                                    </div>
                                    <span className="font-medium text-gray-300 mb-4 mt-2">{project.created_at ? `Created: ${new Date(project.created_at).toLocaleDateString()}` : ''}</span>
                                </div>
                            </li>
                        ))}
                        <li key="add-project-btn" className="flex items-center mb-6">
                            <button
                                onClick={() => setShowAddProjectPopup(true)}
                                className="w-53 h-53 flex items-center justify-center border-4 border-dashed border-blue-400 bg-gradient-to-br from-gray-700 to-blue-800 rounded-2xl text-7xl text-blue-400 hover:bg-blue-700 hover:scale-105 transition-transform duration-200 cursor-pointer font-bold"
                                aria-label="Add new project"
                            >
                                +
                            </button>
                        </li>
                    </ul>

                    {showAddProjectPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 shadow-lg w-96 flex flex-col items-center border-4 border-blue-400">
                                <h2 className="text-2xl font-bold mb-4 text-blue-700">Create New Project</h2>
                                <form className="w-full" onSubmit={handleAddProject}>
                                    <input
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="text"
                                        placeholder="Project name"
                                        value={projectForm.name}
                                        onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <label className="block text-gray-700 mb-1">Start Date</label>
                                    <input
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="date"
                                        value={projectForm.start_date}
                                        onChange={e => setProjectForm({ ...projectForm, start_date: e.target.value })}
                                        required
                                    />
                                    <label className="block text-gray-700 mb-1">End Date</label>
                                    <input
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="date"
                                        value={projectForm.end_date}
                                        onChange={e => setProjectForm({ ...projectForm, end_date: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Description"
                                        value={projectForm.description}
                                        onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                                    />
                                    <textarea
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        placeholder="Dependencies"
                                        value={projectForm.dependencies}
                                        onChange={e => setProjectForm({ ...projectForm, dependencies: e.target.value })}
                                    />
                                    <input
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="text"
                                        placeholder="GitHub Link"
                                        value={projectForm.github_link}
                                        onChange={e => setProjectForm({ ...projectForm, github_link: e.target.value })}
                                    />
                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                                            onClick={() => {
                                                setShowAddProjectPopup(false)
                                                setProjectForm({
                                                    name: '',
                                                    start_date: '',
                                                    end_date: '',
                                                    description: '',
                                                    dependencies: '',
                                                    github_link: ''
                                                })
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-red-600">
                    You must be logged in to view your projects!!!
                </div>
            )}
        </>
    );
};

export default Projects;
