import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../../components/header'
import Loading from '../../components/Loading'
import { toast } from 'react-toastify'

const API = "http://127.0.0.1:8000/api/v1"

const Ideas = () => {
    const { user } = useSelector((state) => state.auth)
    const [ideas, setIdeas] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [error, setError] = useState('')
    const [newIdea, setNewIdea] = useState({ title: '', description: '' })
    const [editId, setEditId] = useState(null)
    const [editData, setEditData] = useState({ title: '', description: '' })

    const fetchIdeas = async (searchTerm = '') => {
        setError('')
        setLoading(true)
        try {
            let url = `${API}/ideas/`
            if (searchTerm) url += `?search=${encodeURIComponent(searchTerm)}`
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${user.access}`,
                    'Content-Type': 'application/json'
                }
            })
            if (!res.ok) throw new Error('Error loading ideas!!!')
            const data = await res.json()
            setIdeas(data)
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchIdeas()
    }, [])

    const handleSearch = (e) => {
        setSearch(e.target.value)
        fetchIdeas(e.target.value)
    }

    const handleAddIdea = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const res = await fetch(`${API}/ideas/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${user.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newIdea)
            })
            if (!res.ok) throw new Error('Error creating idea!!!')
            setNewIdea({ title: '', description: '' })
            fetchIdeas()
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        }
    }

    const handleDelete = async (id) => {
        setError('')
        const confirmDelete = window.confirm('Are you sure you want to delete this idea?')
        if (!confirmDelete) return
        try {
            const res = await fetch(`${API}/ideas/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.access}`,
                }
            })
            if (res.status !== 204) throw new Error('Error deleting idea!!!')
            fetchIdeas()
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        }
    }

    const handleEditClick = (idea) => {
        setEditId(idea.id)
        setEditData({ title: idea.title, description: idea.description })
    }

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value })
    }

    const handleEditSave = async (id) => {
        setError('')
        try {
            const res = await fetch(`${API}/ideas/${id}/`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${user.access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editData)
            })
            if (!res.ok) throw new Error('Error editing idea!!')
            setEditId(null)
            fetchIdeas()
        } catch (err) {
            setError(err.message)
            toast.error(err.message)
        }
    }

    const handleEditCancel = () => {
        setEditId(null)
        setEditData({ title: '', description: '' })
    }

    return (
        <>
            <Header />
            {user ? (
                <div className="min-h-screen bg-gray-700 p-6">
                    <div className='flex flex-row p-6 gap-5 flex-wrap'>
                        <h1 className="text-2xl font-bold mb-4 text-amber-400">Welcome to your personal Ideas. You can search here:</h1>
                        <div className='flex-row flex relative'>
                            <input
                                className="bg-gray-800 h-10 text-gray-200 pl-4 pr-10 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all w-64"
                                type="text"
                                placeholder="Search by title..."
                                value={search}
                                onChange={handleSearch}

                            />
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <form onSubmit={handleAddIdea} className="mb-6 bg-gray-800 p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4 text-amber-400">Add New Idea</h2>
                        <div className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newIdea.title}
                                onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                                required
                                className="bg-gray-800 text-gray-200 pl-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
                            />
                            <textarea
                                placeholder="Description"
                                value={newIdea.description}
                                onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                                required
                                className="bg-gray-800 whitespace-pre-wrap text-gray-200 pl-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all min-h-[100px]"
                            />
                            <button
                                type="submit"
                                className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 self-start"
                            >
                                Add Idea
                            </button>
                        </div>
                    </form>

                    {loading && <Loading />}

                    <div className="space-y-4">
                        {ideas.map(idea => (
                            <div key={idea.id} className="bg-gray-800 rounded-lg shadow-md ">
                                <div className="p-4">
                                    {editId !== idea.id ? (
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                            <div className="text-gray-200 sm:pr-4">
                                                <h3 className="text-2xl font-semibold text-amber-400 break-words">{idea.title}</h3>

                                                <span className="text-gray-100 break-words max-w-275 block">{idea.description}</span>
                                                <div className="text-xs text-gray-400">{new Date(idea.date).toLocaleString()}</div>
                                            </div>
                                            <div className="flex gap-2 mt-2 sm:mt-0">
                                                <button
                                                    onClick={() => handleEditClick(idea)}
                                                    className="text-blue-500 hover:text-blue-400 p-1"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(idea.id)}
                                                    className="text-red-500 hover:text-red-400 p-1"
                                                    title="Delete"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                name="title"
                                                value={editData.title}
                                                onChange={handleEditChange}
                                                placeholder="Title"
                                                className="bg-gray-800 text-gray-200 pl-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all w-full"
                                            />
                                            <textarea
                                                name="description"
                                                value={editData.description}
                                                onChange={handleEditChange}
                                                placeholder="Description"
                                                className="bg-gray-800 whitespace-pre-wrap text-gray-200 pl-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all w-full min-h-[100px]"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEditSave(idea.id)}
                                                    className="bg-amber-500 hover:bg-amber-600 text-black py-1 px-3 rounded-lg text-sm"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleEditCancel}
                                                    className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {ideas.length === 0 && !loading && (
                            <div className="text-center py-10 text-gray-400">
                                No ideas found. Add your first idea!
                            </div>
                        )}
                    </div>

                </div>
            ) : (
                <div className="text-center text-red-600">
                    You must be logged in to view library details!
                </div>
            )}
        </>
    )
}

export default Ideas