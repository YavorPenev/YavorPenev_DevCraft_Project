import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router'

const API = "http://127.0.0.1:8000/api/v1"

const LibraryDetails = () => {
    const { libraryId } = useParams()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)
    const [library, setLibrary] = useState(null)
    const [sources, setSources] = useState([])
    const [sourceForm, setSourceForm] = useState({ type: 'link', description: '', url: '', image: null, file: null, note_title: '', note_description: '' })
    const [editingSourceId, setEditingSourceId] = useState(null)
    const [editingSourceData, setEditingSourceData] = useState({})

    const fetchLibrary = async () => {
        try {
            const res = await fetch(`${API}/libraries/${libraryId}/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            })
            if (!res.ok) throw new Error('Failed to fetch library!')
            const data = await res.json()
            setLibrary(data)
        } catch (err) {
            alert('Error fetching library')
            navigate('/useful-sources')
        }
    }

    const fetchSources = async () => {
        try {
            const res = await fetch(`${API}/libraries/${libraryId}/sources/`, {
                headers: { Authorization: `Bearer ${user?.access}` }
            })
            if (!res.ok) throw new Error('Failed to fetch sources!!')
            const data = await res.json()
            setSources(data)
        } catch (err) {
            alert('Error fetching sources!')
        }
    }

    useEffect(() => {
        if (user && libraryId) {
            console.log("Fetching library data for ID:", libraryId);
            fetchLibrary();
            fetchSources();
        }
    }, [user, libraryId]);

    const handleAddSource = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('type', sourceForm.type)
        if (sourceForm.type !== 'note') {
            formData.append('description', sourceForm.description)
        }
        if (sourceForm.type === 'link') formData.append('url', sourceForm.url)
        if (sourceForm.type === 'image' && sourceForm.image) formData.append('image', sourceForm.image)
        if (sourceForm.type === 'file' && sourceForm.file) formData.append('file', sourceForm.file)
        if (sourceForm.type === 'note') {
            formData.append('note_title', sourceForm.note_title || '')
            formData.append('note_description', sourceForm.note_description || '')
        }

        try {
            await fetch(`${API}/libraries/${libraryId}/sources/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user?.access}` },
                body: formData
            })
            setSourceForm({ type: 'link', description: '', url: '', image: null, file: null, note_title: '', note_description: '' })
            fetchSources()
        } catch (err) {
            alert('Error adding source!!')
        }
    }

    const handleDeleteSource = async (src) => {
        if (window.confirm("Are you sure you want to Delete this source?")) {
            try {
                await fetch(`${API}/sources/${src.id}/`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${user?.access}` }
                })
                fetchSources()
            } catch (err) {
                alert('Error deleting source!')
            }
        }
    }

    return (
        <>
            <Header />
            {user ? (
                <div className='min-h-screen bg-gray-700 p-6'>
                    <div className='mb-6 relative flex items-center justify-center'>
                        <div className='absolute left-0'>
                            <button
                                onClick={() => navigate('/useful-sources')}
                                className='bg-cyan-500 text-white px-4 py-2 rounded-lg flex flex-row items-center hover:bg-cyan-600 transition'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                </svg>
                                Back to Libraries
                            </button>
                        </div>
                        {library && <h1 className='text-3xl font-bold text-cyan-400 text-center'>{library.name}</h1>}
                    </div>

                    {library && (
                        <>
                            <div className='bg-gray-800 rounded-lg p-6 mb-8'>
                                <h2 className='text-2xl font-bold text-emerald-400 mb-4'>Add New Source</h2>
                                <form onSubmit={handleAddSource} className='space-y-4'>
                                    <div>
                                        <label className='block text-gray-300 mb-2'>Source Type</label>
                                        <select
                                            className='w-full bg-gray-700 text-white p-2 rounded'
                                            value={sourceForm.type}
                                            onChange={e => setSourceForm({ ...sourceForm, type: e.target.value })}
                                        >
                                            <option value="link">Link</option>
                                            <option value="image">Image</option>
                                            <option value="file">File</option>
                                            <option value="note">Note</option>
                                        </select>
                                    </div>

                                    {sourceForm.type === 'link' && (
                                        <div>
                                            <label className='block text-gray-300 mb-2'>URL</label>
                                            <input
                                                className='w-full bg-gray-700 text-white p-2 rounded'
                                                type="url"
                                                placeholder="URL"
                                                value={sourceForm.url}
                                                onChange={e => setSourceForm({ ...sourceForm, url: e.target.value })}
                                                required
                                            />
                                        </div>
                                    )}

                                    {sourceForm.type === 'image' && (
                                        <div>
                                            <label className='block text-gray-300 mb-2'>Image</label>
                                            <input
                                                className='w-full bg-gray-700 text-white p-2 rounded'
                                                type="file"
                                                accept="image/*"
                                                onChange={e => setSourceForm({ ...sourceForm, image: e.target.files[0] })}
                                                required
                                            />
                                        </div>
                                    )}

                                    {sourceForm.type === 'file' && (
                                        <div>
                                            <label className='block text-gray-300 mb-2'>File</label>
                                            <input
                                                className='w-full bg-gray-700 text-white p-2 rounded'
                                                type="file"
                                                onChange={e => setSourceForm({ ...sourceForm, file: e.target.files[0] })}
                                                required
                                            />
                                        </div>
                                    )}

                                    {sourceForm.type === 'note' && (
                                        <>
                                            <div>
                                                <label className='block text-gray-300 mb-2'>Note Title</label>
                                                <input
                                                    className='w-full bg-gray-700 text-white p-2 rounded'
                                                    type="text"
                                                    placeholder="Note title"
                                                    value={sourceForm.note_title || ''}
                                                    onChange={e => setSourceForm({ ...sourceForm, note_title: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className='block text-gray-300 mb-2'>Note Content</label>
                                                <textarea
                                                    className='w-full bg-gray-700 text-white p-2 rounded'
                                                    placeholder="Note description"
                                                    value={sourceForm.note_description || ''}
                                                    onChange={e => setSourceForm({ ...sourceForm, note_description: e.target.value })}
                                                    required
                                                    rows={4}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {sourceForm.type !== 'note' && (
                                        <div>
                                            <label className='block text-gray-300 mb-2'>Description</label>
                                            <textarea
                                                className='w-full bg-gray-700 text-white p-2 rounded'
                                                placeholder="Description"
                                                value={sourceForm.description}
                                                onChange={e => setSourceForm({ ...sourceForm, description: e.target.value })}
                                                required
                                                rows={4}
                                            />
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className='bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition'
                                    >
                                        Add Source
                                    </button>
                                </form>
                            </div>

                            <div className='bg-gray-800 rounded-lg p-6'>
                                {sources.length === 0 ? (
                                    <p className='text-gray-300'>No sources added yet..</p>
                                ) : (
                                    <div className='grid grid-cols-1 gap-6'>
                                        {sources.map(src => (
                                            <div key={src.id} className='bg-gray-700 p-4 rounded-lg'>
                                                {editingSourceId === src.id ? (
                                                    <form
                                                        onSubmit={async e => {
                                                            e.preventDefault()
                                                            const formData = new FormData()
                                                            formData.append('type', editingSourceData.type)
                                                            if (editingSourceData.type !== 'note') {
                                                                formData.append('description', editingSourceData.description)
                                                            }
                                                            if (editingSourceData.type === 'link') formData.append('url', editingSourceData.url)
                                                            if (editingSourceData.type === 'image' && editingSourceData.image instanceof File) {
                                                                formData.append('image', editingSourceData.image)
                                                            }
                                                            if (editingSourceData.type === 'file' && editingSourceData.file instanceof File) {
                                                                formData.append('file', editingSourceData.file)
                                                            }
                                                            if (editingSourceData.type === 'note') {
                                                                formData.append('note_title', editingSourceData.note_title || '')
                                                                formData.append('note_description', editingSourceData.note_description || '')
                                                            }
                                                            try {
                                                                await fetch(`${API}/sources/${src.id}/`, {
                                                                    method: 'PATCH',
                                                                    headers: { Authorization: `Bearer ${user?.access}` },
                                                                    body: formData
                                                                })
                                                                setEditingSourceId(null)
                                                                fetchSources()
                                                            } catch (err) {
                                                                alert('Error updating source')
                                                            }
                                                        }}
                                                        className='space-y-4'
                                                    >
                                                        <div>
                                                            <label className='block text-gray-300 mb-2'>Source Type</label>
                                                            <select
                                                                className='w-full bg-gray-600 text-white p-2 rounded'
                                                                value={editingSourceData.type}
                                                                onChange={e => setEditingSourceData({ ...editingSourceData, type: e.target.value })}
                                                            >
                                                                <option value="link">Link</option>
                                                                <option value="image">Image</option>
                                                                <option value="file">File</option>
                                                                <option value="note">Note</option>
                                                            </select>
                                                        </div>

                                                        {editingSourceData.type === 'link' && (
                                                            <div>
                                                                <label className='block text-gray-300 mb-2'>URL</label>
                                                                <input
                                                                    className='w-full bg-gray-600 text-white p-2 rounded'
                                                                    type="url"
                                                                    placeholder="URL"
                                                                    value={editingSourceData.url || ''}
                                                                    onChange={e => setEditingSourceData({ ...editingSourceData, url: e.target.value })}
                                                                    required
                                                                />
                                                            </div>
                                                        )}

                                                        {editingSourceData.type === 'image' && (
                                                            <div>
                                                                <label className='block text-gray-300 mb-2'>Image</label>
                                                                <input
                                                                    className='w-full bg-gray-600 text-white p-2 rounded'
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={e => setEditingSourceData({ ...editingSourceData, image: e.target.files[0] })}
                                                                />
                                                            </div>
                                                        )}

                                                        {editingSourceData.type === 'file' && (
                                                            <div>
                                                                <label className='block text-gray-300 mb-2'>File</label>
                                                                <input
                                                                    className='w-full bg-gray-600 text-white p-2 rounded'
                                                                    type="file"
                                                                    onChange={e => setEditingSourceData({ ...editingSourceData, file: e.target.files[0] })}
                                                                />
                                                            </div>
                                                        )}

                                                        {editingSourceData.type === 'note' && (
                                                            <>
                                                                <div>
                                                                    <label className='block text-gray-300 mb-2'>Note Title</label>
                                                                    <input
                                                                        className='w-full bg-gray-600 text-white p-2 rounded'
                                                                        type="text"
                                                                        placeholder="Note title"
                                                                        value={editingSourceData.note_title || ''}
                                                                        onChange={e => setEditingSourceData({ ...editingSourceData, note_title: e.target.value })}
                                                                        required
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className='block text-gray-300 mb-2'>Note Content</label>
                                                                    <textarea
                                                                        className='w-full bg-gray-600 text-white p-2 rounded'
                                                                        placeholder="Note description"
                                                                        value={editingSourceData.note_description || ''}
                                                                        onChange={e => setEditingSourceData({ ...editingSourceData, note_description: e.target.value })}
                                                                        required
                                                                        rows={4}
                                                                    />
                                                                </div>
                                                            </>
                                                        )}

                                                        {editingSourceData.type !== 'note' && (
                                                            <div>
                                                                <label className='block text-gray-300 mb-2'>Description</label>
                                                                <textarea
                                                                    className='w-full bg-gray-600 text-white p-2 rounded'
                                                                    placeholder="Description"
                                                                    value={editingSourceData.description || ''}
                                                                    onChange={e => setEditingSourceData({ ...editingSourceData, description: e.target.value })}
                                                                    required
                                                                    rows={4}
                                                                />
                                                            </div>
                                                        )}

                                                        <div className='flex space-x-2'>
                                                            <button
                                                                type="submit"
                                                                className='bg-emerald-500 text-white px-4 py-2 rounded hover:bg-emerald-600 transition'
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition'
                                                                onClick={() => setEditingSourceId(null)}
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <>
                                                        <div className='flex justify-between mb-2'>
                                                            <div className='text-emerald-400 text-2xl font-bold'>Type: {src.type}</div>
                                                            <div className='space-x-2'>
                                                                <button
                                                                    className='bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 transition'
                                                                    onClick={() => {
                                                                        setEditingSourceId(src.id)
                                                                        setEditingSourceData(src)
                                                                    }}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    className='bg-pink-600 text-white px-3 py-1 rounded hover:bg-red-700 transition'
                                                                    onClick={() => handleDeleteSource(src)}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {src.type === 'note' ? (
                                                            <div className='mt-3'>
                                                                <h4 className='text-xl text-white font-bold'>{src.note_title}</h4>
                                                                <p className='text-gray-300 mt-1 text-lg'>{src.note_description}</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {src.url && (
                                                                    <div className='mt-2'>
                                                                        <a
                                                                            href={src.url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className='text-blue-400 hover:underline break-all'
                                                                        >
                                                                            {src.url}
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                {src.image && (
                                                                    <div className='mt-4'>
                                                                        <img
                                                                            src={`http://127.0.0.1:8000${src.image}`}
                                                                            alt={src.description || 'Image'}
                                                                            className='w-full rounded'
                                                                        />
                                                                    </div>
                                                                )}

                                                                {src.file && (
                                                                    <div className='mt-2'>
                                                                        <a
                                                                            href={`http://127.0.0.1:8000${src.file}`}
                                                                            download
                                                                            className='text-blue-400 hover:underline break-all'
                                                                        >
                                                                            Download File
                                                                        </a>
                                                                    </div>
                                                                )}

                                                                <div className='text-gray-300 mt-4  pt-2'>
                                                                    <p className='text-2xl font-bold'>Description:</p>
                                                                    <p className='text-lg '>{src.description}</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="text-center text-red-600">
                    You must be logged in to view library details!
                </div>
            )}
        </>
    )
}

export default LibraryDetails
