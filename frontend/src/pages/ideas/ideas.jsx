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
                <div className="max-w-2xl mx-auto mt-8">
                    <h1 className="text-2xl font-bold mb-4">My Ideas</h1>
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={handleSearch}
                    />
                    <form onSubmit={handleAddIdea} className="mb-6">
                        <input
                            type="text"
                            placeholder="Title"
                            value={newIdea.title}
                            onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newIdea.description}
                            onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                            required
                        />
                        <button type="submit" >Add</button>
                    </form>
                    {loading && <Loading />}
                    <ul>
                        {ideas.map(idea => (
                            <li key={idea.id} className="border-b py-2 flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <strong>{idea.title}</strong> <br />
                                        <span className="text-gray-600 break-words max-w-xl block">{idea.description}</span>
                                        <div className="text-xs text-gray-400">{new Date(idea.date).toLocaleString()}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(idea)}
                                        >Edit</button>
                                        <button
                                            onClick={() => handleDelete(idea.id)}
                                        >Delete</button>
                                    </div>
                                </div>
                                {editId === idea.id && (
                                    <div >
                                        <input
                                            type="text"
                                            name="title"
                                            value={editData.title}
                                            onChange={handleEditChange}
                                            className="border px-2 py-1 mr-2 mb-2 w-full"
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={editData.description}
                                            onChange={handleEditChange}
                                            className="border px-2 py-1 mr-2 mb-2 w-full"
                                            placeholder="Description"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditSave(idea.id)}
                                            >Save</button>
                                            <button
                                                onClick={handleEditCancel}
                                            >Cancel</button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center  text-red-600">
                    You must be logged in to view your ideas!!!!!
                </div>
            )}
        </>
    )
}

export default Ideas