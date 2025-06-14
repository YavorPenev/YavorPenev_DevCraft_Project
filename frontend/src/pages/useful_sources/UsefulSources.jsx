import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

const API = "http://127.0.0.1:8000/api/v1"

const UsefulSources = () => {
    const { user } = useSelector((state) => state.auth)
    const navigate = useNavigate()
    const [libraries, setLibraries] = useState([])
    const [search, setSearch] = useState('')
    const [showAddLibraryPopup, setShowAddLibraryPopup] = useState(false)
    const [popupLibraryName, setPopupLibraryName] = useState('')
    const [editingLibrary, setEditingLibrary] = useState(null)
    const [editLibraryName, setEditLibraryName] = useState('')
    const [showEditLibraryPopup, setShowEditLibraryPopup] = useState(false)

    const fetchLibraries = async (searchValue = '') => {
        try {
            const res = await fetch(`${API}/libraries/?search=${encodeURIComponent(searchValue)}`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            })
            if (!res.ok) throw new Error('Failed to fetch libraries!')
            const data = await res.json()
            setLibraries(data)
        } catch (err) {
            alert('Error fetching libraries!!!')
        }
    }

    useEffect(() => {
        if (user) fetchLibraries()
    }, [user])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        fetchLibraries(e.target.value)
    }

    const handleDeleteLibrary = async (lib) => {
        try {
            const res = await fetch(`${API}/libraries/${lib.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.access}` }
            })
            if (!res.ok) throw new Error('Failed to delete library!')
            fetchLibraries()
        } catch (err) {
            alert('Error deleting library!!')
        }
    }


    const handleSelectLibrary = (lib) => {
        console.log("Navigating to library:", lib.id);
        navigate(`/useful-sources/${lib.id}`)
    }

    const handlePopupAddLibrary = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch(`${API}/libraries/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: popupLibraryName })
            })
            if (!res.ok) throw new Error('Failed to create library!')
            setPopupLibraryName('')
            setShowAddLibraryPopup(false)
            fetchLibraries()
        } catch (err) {
            alert('Error creating library')
        }
    }

    const handleEditLibrary = (e, lib) => {
        e.stopPropagation();
        setEditingLibrary(lib);
        setEditLibraryName(lib.name);
        setShowEditLibraryPopup(true);
    }

    const handleUpdateLibrary = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API}/libraries/${editingLibrary.id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user?.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: editLibraryName })
            });
            if (!res.ok) throw new Error('Failed to update library!')
            setShowEditLibraryPopup(false);
            setEditingLibrary(null);
            setEditLibraryName('');
            fetchLibraries();
        } catch (err) {
            alert('Error updating library')
        }
    }

    return (
        <>
            <Header />
            {user ? (
                <div className='min-h-screen bg-gray-700 '>
                    <div className='flex flex-row items-center'>
                        <h1 className='m-7 font-bold text-emerald-400 text-2xl '>Welcome to your personal Libraries. You can search here:</h1>
                        <input
                            className="bg-gray-800 h-10 text-gray-200 pl-4 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
                            type="text"
                            placeholder="Search by title..."
                            value={search}
                            onChange={handleSearch}
                        />
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
                                            src='../../../libraries.png'
                                            className='w-35 h-40'
                                            alt={lib.name}
                                            onError={(e) => {
                                                console.log("Image failed to load");
                                                e.target.src = 'https://via.placeholder.com/150?text=Library';
                                            }}
                                        />
                                        <h3 className='text-cyan-50'>{lib.name}</h3>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleEditLibrary(e, lib);
                                        }}
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
                                className="w-40 h-44 flex items-center justify-center border-4 border-dashed border-emerald-400 bg-gray-600 rounded-lg text-6xl text-emerald-400 hover:bg-gray-500 transition"
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
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Library</h2>
                                <form className="w-full" onSubmit={handlePopupAddLibrary}>
                                    <input
                                        className="w-full border border-gray-300 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        type="text"
                                        placeholder="Library name"
                                        value={popupLibraryName}
                                        onChange={e => setPopupLibraryName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                                            onClick={() => {
                                                setShowAddLibraryPopup(false)
                                                setPopupLibraryName('')
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {showEditLibraryPopup && editingLibrary && (
                        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                            <div className="bg-gray-600 rounded-lg border-cyan-400 border-2 p-8 shadow-lg w-96 flex flex-col items-center">
                                <h2 className="text-2xl font-bold mb-4 text-cyan-500">Edit Library</h2>
                                <form className="w-full" onSubmit={handleUpdateLibrary}>
                                    <input
                                        className="w-full border border-gray-200 rounded px-3 py-2 mb-6 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        type="text"
                                        placeholder="Library name"
                                        value={editLibraryName}
                                        onChange={e => setEditLibraryName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <div className="flex justify-between w-full">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                                            onClick={() => {
                                                if (window.confirm("Are you sure you want to delete this library?")) {
                                                    handleDeleteLibrary(editingLibrary);
                                                    setShowEditLibraryPopup(false);
                                                    setEditingLibrary(null);
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
                                                    setEditingLibrary(null);
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
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

                <div className="text-center  text-red-600">
                    You must be logged in to view your useful sources!!!!!
                </div>
            )}
        </>
    )
}

export default UsefulSources