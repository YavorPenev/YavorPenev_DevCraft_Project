import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

const API = "http://127.0.0.1:8000/api/v1";

const CodeFragments = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [libraries, setLibraries] = useState([]);
    const [search, setSearch] = useState('');
    const [showAddLibraryPopup, setShowAddLibraryPopup] = useState(false);
    const [libraryForm, setLibraryForm] = useState({ language: '' });
    const [editingLibraryId, setEditingLibraryId] = useState(null);
    const [editingLibraryData, setEditingLibraryData] = useState({ language: '' });
    const [showEditLibraryPopup, setShowEditLibraryPopup] = useState(false);

    const fetchLibraries = async (searchValue = '') => {
        try {
            const res = await fetch(`${API}/codeLibraries/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch code libraries!');
            const data = await res.json();
            setLibraries(
                searchValue
                    ? data.filter(lib => lib.language.toLowerCase().includes(searchValue.toLowerCase()))
                    : data
            );
        } catch (err) {
            alert('Error fetching code libraries!');
        }
    };

    useEffect(() => {
        if (user) fetchLibraries();
    }, [user]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        fetchLibraries(e.target.value);
    };

    const handleAddLibrary = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/codeLibraries/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(libraryForm)
            });
            if (!res.ok) throw new Error('Failed to create library!');
            setLibraryForm({ language: '' });
            setShowAddLibraryPopup(false);
            fetchLibraries();
        } catch (err) {
            alert('Error creating library');
        }
    };

    const handleEditLibrary = (e, lib) => {
        e.stopPropagation();
        setEditingLibraryId(lib.id);
        setEditingLibraryData({ language: lib.language });
        setShowEditLibraryPopup(true);
    };

    const handleUpdateLibrary = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/codeLibraries/${editingLibraryId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingLibraryData)
            });
            if (!res.ok) throw new Error('Failed to update library!');
            setShowEditLibraryPopup(false);
            setEditingLibraryId(null);
            setEditingLibraryData({ language: '' });
            fetchLibraries();
        } catch (err) {
            alert('Error updating library');
        }
    };

    const handleDeleteLibrary = async (lib) => {
        try {
            const res = await fetch(`${API}/codeLibraries/${lib.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to delete library!');
            fetchLibraries();
        } catch (err) {
            alert('Error deleting library!');
        }
    };

    const handleSelectLibrary = (lib) => {
        navigate(`/code-fragments/${lib.id}`);
    };

    return (
        <>
            <Header />
            {user ? (
                <div className='min-h-screen bg-gray-700'>
                    <div className='flex flex-row items-center'>
                        <h1 className='m-7 font-bold text-blue-400 text-2xl'>Your Code Libraries. Search by language:</h1>
                        <div className='flex-row flex relative'>
                            <input
                                className="bg-gray-800 h-10 text-gray-200 pl-4 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all w-64"
                                type="text"
                                placeholder="Search by language..."
                                value={search}
                                onChange={handleSearch}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <ul className='flex flex-row flex-wrap justify-start mx-8 gap-6'>
                        {libraries.map(lib => (
                            <li key={lib.id} className="mb-6">
                                <div className='relative font-extrabold border-black border-3 text-center pr-4 pl-4 bg-gray-500 rounded-lg hover:bg-gray-400 transition'>
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => handleSelectLibrary(lib)}
                                    >
                                        <img
                                            src='../../../public/codelibrary.png'
                                            className='w-39 h-40 pt-2'
                                            alt={lib.language}
                                        />
                                        <h3 className='text-cyan-50'>{lib.language}</h3>
                                    </div>
                                    <button
                                        onClick={(e) => handleEditLibrary(e, lib)}
                                        className="absolute bottom-2 right-2 bg-gray-600 hover:bg-gray-500 rounded-full p-1 transition"
                                        aria-label="Edit library"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        ))}
                        <li key="add-library-btn" className="flex items-center mb-6">
                            <button
                                onClick={() => setShowAddLibraryPopup(true)}
                                className="w-40 h-44 flex items-center justify-center border-4 border-dashed border-blue-400 bg-gray-600 rounded-lg text-6xl text-blue-400 hover:bg-gray-500 transition"
                                style={{ fontWeight: 'bold', fontSize: '4rem' }}
                                aria-label="Add new library"
                            >
                                +
                            </button>
                        </li>
                    </ul>

                    {showAddLibraryPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 shadow-lg w-96 flex flex-col items-center">
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Code Library</h2>
                                <form className="w-full" onSubmit={handleAddLibrary}>
                                    <input
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="text"
                                        placeholder="Programming language"
                                        value={libraryForm.language}
                                        onChange={e => setLibraryForm({ ...libraryForm, language: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                                            onClick={() => {
                                                setShowAddLibraryPopup(false)
                                                setLibraryForm({ language: '' })
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

                    {showEditLibraryPopup && editingLibraryId && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-gray-600 rounded-lg border-blue-400 border-2 p-8 shadow-lg w-96 flex flex-col items-center">
                                <h2 className="text-2xl font-bold mb-4 text-blue-400">Edit Code Library</h2>
                                <form className="w-full" onSubmit={handleUpdateLibrary}>
                                    <input
                                        className="w-full border border-gray-200 rounded px-3 py-2 mb-6 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        type="text"
                                        placeholder="Programming language"
                                        value={editingLibraryData.language}
                                        onChange={e => setEditingLibraryData({ ...editingLibraryData, language: e.target.value })}
                                        required
                                        autoFocus
                                    />
                                    <div className="flex justify-between w-full">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                                            onClick={() => {
                                                const lib = libraries.find(l => l.id === editingLibraryId);
                                                if (lib && window.confirm("Are you sure you want to Delete this library?")) {
                                                    handleDeleteLibrary(lib);
                                                    setShowEditLibraryPopup(false);
                                                    setEditingLibraryId(null);
                                                }
                                            }}
                                        >
                                            Delete
                                        </button>
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-400"
                                                onClick={() => {
                                                    setShowEditLibraryPopup(false);
                                                    setEditingLibraryId(null);
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
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-red-600">
                    You must be logged in to view your code fragments!!!
                </div>
            )}
        </>
    );
};

export default CodeFragments;