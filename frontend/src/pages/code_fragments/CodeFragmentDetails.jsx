import React, { useEffect, useState } from 'react';
import Header from '../../components/header';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';

const API = "http://127.0.0.1:8000/api/v1";

const CodefragmentDetails = () => {
    const { libraryId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [codeLibrary, setCodeLibrary] = useState(null);
    const [fragments, setFragments] = useState([]);
    const [search, setSearch] = useState('');
    const [fragmentForm, setFragmentForm] = useState({
        title: '',
        code: '',
        description: ''
    });
    const [showAddFragmentPopup, setShowAddFragmentPopup] = useState(false);
    const [showFragmentDetailPopup, setShowFragmentDetailPopup] = useState(false);
    const [selectedFragment, setSelectedFragment] = useState(null);
    const [editingFragmentId, setEditingFragmentId] = useState(null);
    const [editingFragmentData, setEditingFragmentData] = useState({
        title: '', code: '', description: ''
    });

    const fetchCodeLibrary = async () => {
        try {
            const res = await fetch(`${API}/codeLibraries/${libraryId}/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch code library');
            const data = await res.json();
            setCodeLibrary(data);
        } catch (err) {
            alert('Error fetching code library!!');
        }
    };

    const fetchFragments = async (searchValue = '') => {
        try {
            const res = await fetch(`${API}/codeLibraries/${libraryId}/fragments/?search=${encodeURIComponent(searchValue)}`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            });
            if (!res.ok) throw new Error('Failed to fetch fragments');
            const data = await res.json();
            setFragments(data);
        } catch (err) {
            alert('Error fetching fragments!!');
        }
    };

    useEffect(() => {
        if (user && libraryId) {
            fetchCodeLibrary();
            fetchFragments();
        }
    }, [user, libraryId]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        fetchFragments(e.target.value);
    };

    const handleAddFragment = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/codeLibraries/${libraryId}/fragments/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fragmentForm)
            });
            if (!res.ok) throw new Error('Failed to create fragment');
            setFragmentForm({ title: '', code: '', description: '' });
            setShowAddFragmentPopup(false);
            fetchFragments();
        } catch (err) {
            alert('Error creating fragment!!!');
        }
    };

    const handleFragmentClick = (fragment) => {
        setSelectedFragment(fragment);
        setShowFragmentDetailPopup(true);
    };

    const handleEditFragment = (fragment) => {
        setEditingFragmentId(fragment.id);
        setEditingFragmentData({
            title: fragment.title,
            code: fragment.code,
            description: fragment.description
        });
        setShowFragmentDetailPopup(false);
    };

    const handleUpdateFragment = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/fragments/${editingFragmentId}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingFragmentData)
            });
            if (!res.ok) throw new Error('Failed to update fragment');
            setEditingFragmentId(null);
            fetchFragments();
        } catch (err) {
            alert('Error updating fragment!!');
        }
    };

    const handleDeleteFragment = async (fragment) => {
        if (window.confirm("Are you sure you want to delete this fragment?")) {
            try {
                const res = await fetch(`${API}/fragments/${fragment.id}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user?.access}` }
                });
                if (!res.ok) throw new Error('Failed to delete fragment');
                setShowFragmentDetailPopup(false);
                fetchFragments();
            } catch (err) {
                alert('Error deleting fragment!');
            }
        }
    };

    return (
        <>
            <Header />
            {user ? (
                <div className="min-h-screen bg-gray-700 p-6">
                    <div className='mb-6 relative flex items-center justify-center'>
                        <div className='absolute left-0'>
                            <button
                                onClick={() => navigate('/code-fragments')}
                                className='bg-blue-500 text-white px-4 py-2 rounded-lg flex flex-row items-center hover:bg-blue-600 transition'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Libraries
                            </button>
                        </div>
                        {codeLibrary && <h1 className='text-3xl font-bold text-blue-400 text-center'>{codeLibrary.language}</h1>}
                    </div>

                    <div className='flex justify-between items-center mb-4'>
                        <div className='relative flex items-center flex-row'>
                            <h1 className='text-3xl font-bold text-blue-400 mr-3'> View all your snippets:</h1>
                            <input
                                className="bg-gray-800 h-10 text-gray-200 pl-4 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all w-64"
                                type="text"
                                placeholder="Search fragments..."
                                value={search}
                                onChange={handleSearch}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            onClick={() => setShowAddFragmentPopup(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-lg transition-colors flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Fragment
                        </button>
                    </div>

                    {fragments.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            No code fragments found. Add your first fragment!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {fragments.map(fragment => (
                                <div
                                    key={fragment.id}
                                    className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => handleFragmentClick(fragment)}
                                >
                                    <div className="p-4 flex flex-col items-center">
                                        <img
                                            src="../../../code.png"
                                            alt="Code Fragment"
                                            className="h-24 w-24 mb-3"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/150?text=CodeFragment';
                                            }}
                                        />
                                        <h3 className="text-lg font-semibold text-blue-400 text-center truncate w-full">
                                            {fragment.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {showAddFragmentPopup && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold text-blue-400 mb-4">Add New Code Fragment</h2>
                                <form onSubmit={handleAddFragment} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-300 mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 text-white p-2 rounded"
                                            placeholder="Fragment title"
                                            value={fragmentForm.title}
                                            onChange={e => setFragmentForm({ ...fragmentForm, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Code</label>
                                        <div className="w-full bg-gray-700 text-white rounded overflow-hidden">
                                            <textarea
                                                className="w-full p-2 font-mono whitespace-pre overflow-x-auto resize-y h-64"
                                                placeholder="Paste your code here"
                                                value={fragmentForm.code}
                                                onChange={e => setFragmentForm({ ...fragmentForm, code: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Description</label>
                                        <textarea
                                            className="w-full bg-gray-700 text-white p-2 rounded resize-y"
                                            placeholder="Description of what this code does"
                                            rows={4}
                                            value={fragmentForm.description}
                                            onChange={e => setFragmentForm({ ...fragmentForm, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                                            onClick={() => setShowAddFragmentPopup(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showFragmentDetailPopup && selectedFragment && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-blue-400">{selectedFragment.title}</h2>
                                    <button
                                        onClick={() => setShowFragmentDetailPopup(false)}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="bg-gray-900 p-4 rounded-lg mb-4 overflow-auto max-h-[400px]">
                                    <pre className="text-gray-300 font-mono whitespace-pre overflow-auto block">{selectedFragment.code}</pre>
                                </div>
                                {selectedFragment.description && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-300 mb-2">Description:</h3>
                                        <p className="text-gray-400 whitespace-pre-wrap">{selectedFragment.description}</p>
                                    </div>
                                )}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDeleteFragment(selectedFragment)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => handleEditFragment(selectedFragment)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {editingFragmentId && (
                        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                <h2 className="text-2xl font-bold text-blue-400 mb-4">Edit Code Fragment</h2>
                                <form onSubmit={handleUpdateFragment} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-300 mb-1">Title</label>
                                        <input
                                            type="text"
                                            className="w-full bg-gray-700 text-white p-2 rounded"
                                            placeholder="Fragment title"
                                            value={editingFragmentData.title}
                                            onChange={e => setEditingFragmentData({ ...editingFragmentData, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Code</label>
                                        <div className="w-full bg-gray-700 text-white rounded overflow-auto max-h-[400px]">
                                            <textarea
                                                className="w-full p-2 font-mono whitespace-pre overflow-auto resize-none h-64"
                                                placeholder="Paste your code here"
                                                value={editingFragmentData.code}
                                                onChange={e => setEditingFragmentData({ ...editingFragmentData, code: e.target.value })}
                                                required
                                                style={{ whiteSpace: 'pre', overflow: 'auto' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 mb-1">Description</label>
                                        <textarea
                                            className="w-full bg-gray-700 text-white p-2 rounded resize-y"
                                            placeholder="Description of what this code does"
                                            rows={4}
                                            value={editingFragmentData.description}
                                            onChange={e => setEditingFragmentData({ ...editingFragmentData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                                            onClick={() => setEditingFragmentId(null)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Update
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                
            ) : (

                <div className="text-center text-red-600">
                    You must be logged in to view code fragments!
                </div>
            )}
        </>
    );
};


;

export default CodefragmentDetails;
