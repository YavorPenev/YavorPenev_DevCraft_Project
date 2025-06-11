
import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import { useSelector } from 'react-redux';

const API = "http://127.0.0.1:8000/api/v1";

const CodeFragments = () => {
    const { user } = useSelector((state) => state.auth);
    const [codeLibraries, setCodeLibraries] = useState([]);
    const [libraryName, setLibraryName] = useState('');
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [fragments, setFragments] = useState([]);
    const [fragmentForm, setFragmentForm] = useState({ title: '', code: '', description: '' });
    const [search, setSearch] = useState('');
    const [editingFragmentId, setEditingFragmentId] = useState(null);
    const [editingLibraryId, setEditingLibraryId] = useState(null);
    const [editingLanguage, setEditingLanguage] = useState('');
    const [editingFragmentData, setEditingFragmentData] = useState({
        title: '', code: '', description: ''
    });
    const fetchLibraries = async () => {
        try {
            const res = await fetch(`${API}/codeLibraries/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch libraries');
            const data = await res.json();
            setCodeLibraries(data);
        } catch (err) {
            alert('Error fetching libraries');
        }
    };

    const fetchFragments = async (libraryId, searchValue = '') => {
        try {
            const res = await fetch(`${API}/codeLibraries/${libraryId}/fragments/?search=${encodeURIComponent(searchValue)}`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch fragments');
            const data = await res.json();
            setFragments(data);
        } catch (err) {
            alert('Error fetching fragments');
        }
    };

    useEffect(() => {
        if (user) fetchLibraries();
    }, [user]);

    const handleAddLibrary = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API}/codeLibraries/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ language: libraryName })
            });
            setLibraryName('');
            fetchLibraries();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSelectLibrary = (lib) => {
        setSelectedLibrary(lib);
        fetchFragments(lib.id);
    };

    const handleDeleteLibrary = async (lib) => {
    if (window.confirm("Are you sure you want to Delete this library?")) {
        try {
            await fetch(`${API}/codeLibraries/${lib.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            setSelectedLibrary(selectedLibrary?.id === lib.id ? null : selectedLibrary);
            fetchLibraries();
        } catch (err) {
            alert(err.message);
        }
    }
};

    const handleAddFragment = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API}/codeLibraries/${selectedLibrary.id}/fragments/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fragmentForm)
            });
            setFragmentForm({ title: '', code: '', description: '' });
            fetchFragments(selectedLibrary.id);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteFragment = async (frag) => {
        if (window.confirm("Are you sure you want to delete this fragment?")) {
            try {
                await fetch(`${API}/fragments/${frag.id}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user?.access}` }
                });
                fetchFragments(selectedLibrary.id);
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleUpdateLibrary = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API}/codeLibraries/${editingLibraryId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ language: editingLanguage })
            });
            setEditingLibraryId(null);
            fetchLibraries();
            if (selectedLibrary?.id === editingLibraryId) {
                setSelectedLibrary({ ...selectedLibrary, language: editingLanguage });
            }
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUpdateFragment = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API}/fragments/${editingFragmentId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingFragmentData)
            });
            setEditingFragmentId(null);
            fetchFragments(selectedLibrary.id);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <>
            <Header />
            {user ? (
                <div>
                    <h2>Code Libraries</h2>
                    <form onSubmit={handleAddLibrary}>
                        <input
                            type="text"
                            placeholder="Language"
                            value={libraryName}
                            onChange={e => setLibraryName(e.target.value)}
                            required
                        />
                        <button type="submit">Add Library</button>
                    </form>

                    <ul>
                        {codeLibraries.map(lib => (
                            <li key={lib.id}>
                                {editingLibraryId === lib.id ? (
                                    <form onSubmit={handleUpdateLibrary}>
                                        <input
                                            value={editingLanguage}
                                            onChange={e => setEditingLanguage(e.target.value)}
                                        />
                                        <button type="submit">Save</button>
                                        <button onClick={() => setEditingLibraryId(null)}>Cancel</button>
                                    </form>
                                    
                                ) : (

                                    <>
                                        <button onClick={() => handleSelectLibrary(lib)}>
                                            {lib.language}
                                        </button>
                                        <button onClick={() => {
                                            setEditingLibraryId(lib.id);
                                            setEditingLanguage(lib.language);
                                        }}>Edit</button>
                                        <button onClick={() => handleDeleteLibrary(lib)}>Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    {selectedLibrary && (
                        <div>
                            <h3>
                                Fragments in {selectedLibrary.language}
                                <button onClick={() => {
                                    setEditingLibraryId(selectedLibrary.id);
                                    setEditingLanguage(selectedLibrary.language);
                                }}>Edit</button>
                            </h3>

                            <input
                                type="text"
                                placeholder="Search fragments..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    fetchFragments(selectedLibrary.id, e.target.value);
                                }}
                            />

                            <form onSubmit={handleAddFragment}>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={fragmentForm.title}
                                    onChange={e => setFragmentForm({ ...fragmentForm, title: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Code"
                                    value={fragmentForm.code}
                                    onChange={e => setFragmentForm({ ...fragmentForm, code: e.target.value })}
                                    rows="10"
                                    required
                                />
                                <textarea
                                    placeholder="Description"
                                    value={fragmentForm.description}
                                    onChange={e => setFragmentForm({ ...fragmentForm, description: e.target.value })}
                                    rows="3"
                                />
                                <button type="submit">Add Fragment</button>
                            </form>
                            <ul>

                                {fragments.map(frag => (
                                    <li key={frag.id}>
                                        {editingFragmentId === frag.id ? (
                                            <form onSubmit={handleUpdateFragment}>
                                                <input
                                                    value={editingFragmentData.title}
                                                    onChange={e => setEditingFragmentData({
                                                        ...editingFragmentData,
                                                        title: e.target.value
                                                    })}
                                                />
                                                <textarea
                                                    value={editingFragmentData.code}
                                                    onChange={e => setEditingFragmentData({
                                                        ...editingFragmentData,
                                                        code: e.target.value
                                                    })}
                                                    rows="10"
                                                />
                                                <textarea
                                                    value={editingFragmentData.description}
                                                    onChange={e => setEditingFragmentData({
                                                        ...editingFragmentData,
                                                        description: e.target.value
                                                    })}
                                                    rows="3"
                                                />
                                                <button type="submit">Save</button>
                                                <button onClick={() => setEditingFragmentId(null)}>Cancel</button>
                                            </form>

                                        ) : (

                                            <>
                                
                                                    <h4><b>{frag.title}</b></h4>
                                                <pre>{frag.code}</pre>
                                                {frag.description && <p>{frag.description}</p>}
                                                <div>   
                                                    <button onClick={() => handleDeleteFragment(frag)}>Delete</button>
                                                    <button onClick={() => {
                                                        setEditingFragmentId(frag.id);
                                                        setEditingFragmentData(frag);
                                                    }}>Edit</button>
                                                    </div>
                                               
                                                <div>-------------------------------</div>
                                            </>

                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (

                <div className="text-center  text-red-600">
                    You must be logged in to view your code fragments!!!
                </div>
            )}
        </>
    );
};

export default CodeFragments;