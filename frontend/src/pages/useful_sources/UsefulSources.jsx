import React, { useEffect, useState } from 'react'
import Header from '../../components/header'
import { useSelector } from 'react-redux'

const API = "http://127.0.0.1:8000/api/v1"

const UsefulSources = () => {
    const { user } = useSelector((state) => state.auth)
    const [libraries, setLibraries] = useState([])
    const [libraryName, setLibraryName] = useState('')
    const [selectedLibrary, setSelectedLibrary] = useState(null)
    const [sources, setSources] = useState([])
    const [sourceForm, setSourceForm] = useState({ type: 'link', description: '', url: '', image: null, file: null, note_title: '', note_description: '' })
    const [search, setSearch] = useState('')
    const [editingLibraryId, setEditingLibraryId] = useState(null)
    const [editingLibraryName, setEditingLibraryName] = useState('')
    const [editingSourceId, setEditingSourceId] = useState(null)
    const [editingSourceData, setEditingSourceData] = useState({})


    const fetchLibraries = async (searchValue = '') => {
        const res = await fetch(`${API}/libraries/?search=${encodeURIComponent(searchValue)}`, {
            headers: { Authorization: `Bearer ${user?.access}` }
        })
        const data = await res.json()
        setLibraries(data)
    }

    const fetchSources = async (libraryId) => {
        const res = await fetch(`${API}/libraries/${libraryId}/sources/`, {
            headers: { Authorization: `Bearer ${user?.access}` }
        })
        const data = await res.json()
        setSources(data)
    }


    useEffect(() => {
        if (user) fetchLibraries()
    }, [user])

    const handleAddLibrary = async (e) => {
        e.preventDefault()
        await fetch(`${API}/libraries/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${user?.access}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: libraryName })
        })
        setLibraryName('')
        fetchLibraries()
    }


    const handleDeleteLibrary = async (lib) => {
        if (window.confirm("Are you sure you want to delete this library?")) {
            await fetch(`${API}/libraries/${lib.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.access}` }
            })
            setSelectedLibrary(null)
            fetchLibraries()
            setSources([])
        }
    }


    const handleSelectLibrary = (lib) => {
        setSelectedLibrary(lib)
        fetchSources(lib.id)
    }


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

        await fetch(`${API}/libraries/${selectedLibrary.id}/sources/`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${user?.access}` },
            body: formData
        })
        setSourceForm({ type: 'link', description: '', url: '', image: null, file: null, note_title: '', note_description: '' })
        fetchSources(selectedLibrary.id)
    }


    const handleDeleteSource = async (src) => {
        if (window.confirm("Are you sure you want to delete this source?")) {
            await fetch(`${API}/sources/${src.id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${user?.access}` }
            })
            fetchSources(selectedLibrary.id)
        }
    }

    return (
        <>
            <Header />
            {user ? (
                <div>
                    <h2>Libraries</h2>

                    <form className='mb-3'
                        onSubmit={e => {
                            e.preventDefault()
                            fetchLibraries(search)
                        }}
                    >
                        <input className='mr-5'
                            type="text"
                            placeholder="Search libraries..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit">Search</button>
                        <button className='ml-2'
                            type="button"
                            onClick={() => {
                                setSearch('')
                                fetchLibraries('')
                            }}
                        >Clear</button>
                    </form>

                    {/* Форма за създаване на нова библиотека */}
                    <form className='mb-3' onSubmit={handleAddLibrary}>
                        <input className='mr-5'
                            type="text"
                            placeholder="New library name"
                            value={libraryName}
                            onChange={e => setLibraryName(e.target.value)}
                            required
                        />
                        <button type="submit">Create Library</button>
                    </form>

                    <ul>
                        {libraries.map(lib => (
                            <li key={lib.id}>
                                {editingLibraryId === lib.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editingLibraryName}
                                            onChange={e => setEditingLibraryName(e.target.value)}
                                        />
                                        <button
                                            onClick={async () => {
                                                await fetch(`${API}/libraries/${lib.id}/`, {
                                                    method: 'PATCH',
                                                    headers: {
                                                        Authorization: `Bearer ${user?.access}`,
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify({ name: editingLibraryName })
                                                })
                                                setEditingLibraryId(null)
                                                fetchLibraries()
                                            }}
                                        >Save</button>
                                        <button onClick={() => setEditingLibraryId(null)}>Cancel</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => handleSelectLibrary(lib)}>{lib.name}</button>
                                        <button className='ml-2'
                                            onClick={() => {
                                                setEditingLibraryId(lib.id)
                                                setEditingLibraryName(lib.name)
                                            }}

                                        >Edit</button>
                                        <button
                                            onClick={() => handleDeleteLibrary(lib)}
                                        >Delete</button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>

                    {selectedLibrary && (
                        <div>
                            <div>------------------------------------------------</div>
                            <h3>Sources in {selectedLibrary.name}</h3>
                            <form onSubmit={handleAddSource}>
                                <select
                                    value={sourceForm.type}
                                    onChange={e => setSourceForm({ ...sourceForm, type: e.target.value })}
                                >
                                    <option value="link">Link</option>
                                    <option value="image">Image</option>
                                    <option value="file">File</option>
                                    <option value="note">Note</option>
                                </select>
                                {sourceForm.type !== 'note' && (
                                    <input
                                        type="text"
                                        placeholder="Description"
                                        value={sourceForm.description}
                                        onChange={e => setSourceForm({ ...sourceForm, description: e.target.value })}
                                        required
                                    />
                                )}
                                {sourceForm.type === 'link' && (
                                    <input
                                        type="url"
                                        placeholder="URL"
                                        value={sourceForm.url}
                                        onChange={e => setSourceForm({ ...sourceForm, url: e.target.value })}
                                        required
                                    />
                                )}
                                {sourceForm.type === 'image' && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setSourceForm({ ...sourceForm, image: e.target.files[0] })}
                                        required
                                    />
                                )}
                                {sourceForm.type === 'file' && (
                                    <input
                                        type="file"
                                        onChange={e => setSourceForm({ ...sourceForm, file: e.target.files[0] })}
                                        required
                                    />
                                )}
                                {sourceForm.type === 'note' && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Note title"
                                            value={sourceForm.note_title || ''}
                                            onChange={e => setSourceForm({ ...sourceForm, note_title: e.target.value })}
                                            required
                                        />
                                        <textarea
                                            placeholder="Note description"
                                            value={sourceForm.note_description || ''}
                                            onChange={e => setSourceForm({ ...sourceForm, note_description: e.target.value })}
                                            required
                                        />
                                    </>
                                )}
                                <button type="submit">Add</button>
                            </form>

                            <ul>
                                {sources.map(src => (
                                    <li key={src.id}>
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
                                                    await fetch(`${API}/sources/${src.id}/`, {
                                                        method: 'PATCH',
                                                        headers: { Authorization: `Bearer ${user?.access}` },
                                                        body: formData
                                                    })
                                                    setEditingSourceId(null)
                                                    fetchSources(selectedLibrary.id)
                                                }}
                                            >
                                                <select
                                                    value={editingSourceData.type}
                                                    onChange={e => setEditingSourceData({ ...editingSourceData, type: e.target.value })}
                                                >
                                                    <option value="link">Link</option>
                                                    <option value="image">Image</option>
                                                    <option value="file">File</option>
                                                    <option value="note">Note</option>
                                                </select>
                                                {editingSourceData.type !== 'note' && (
                                                    <input
                                                        type="text"
                                                        placeholder="Description"
                                                        value={editingSourceData.description || ''}
                                                        onChange={e => setEditingSourceData({ ...editingSourceData, description: e.target.value })}
                                                        required
                                                    />
                                                )}
                                                {editingSourceData.type === 'link' && (
                                                    <input
                                                        type="url"
                                                        placeholder="URL"
                                                        value={editingSourceData.url || ''}
                                                        onChange={e => setEditingSourceData({ ...editingSourceData, url: e.target.value })}
                                                        required
                                                    />
                                                )}
                                                {editingSourceData.type === 'image' && (
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => setEditingSourceData({ ...editingSourceData, image: e.target.files[0] })}
                                                    />
                                                )}
                                                {editingSourceData.type === 'file' && (
                                                    <input
                                                        type="file"
                                                        onChange={e => setEditingSourceData({ ...editingSourceData, file: e.target.files[0] })}
                                                    />
                                                )}
                                                {editingSourceData.type === 'note' && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            placeholder="Note title"
                                                            value={editingSourceData.note_title || ''}
                                                            onChange={e => setEditingSourceData({ ...editingSourceData, note_title: e.target.value })}
                                                            required
                                                        />
                                                        <textarea
                                                            placeholder="Note description"
                                                            value={editingSourceData.note_description || ''}
                                                            onChange={e => setEditingSourceData({ ...editingSourceData, note_description: e.target.value })}
                                                            required
                                                        />
                                                    </>
                                                )}
                                                <button type="submit">Save</button>
                                                <button type="button" onClick={() => setEditingSourceId(null)}>Cancel</button>
                                            </form>

                                        ) : (
                                            <>

                                                <div>------------------------------------------------</div>
                                                <div>Type: {src.type}</div>
                                                {src.type === 'note' ? (
                                                    <div>
                                                        <strong>{src.note_title}</strong>
                                                        <div>{src.note_description}</div>
                                                    </div>
                                                ) : (
                                                    <div>Description: {src.description}</div>
                                                )}
                                                {src.url && <div>URL: <a href={src.url}>{src.url}</a></div>}
                                                {src.image && (
                                                    <div>
                                                        Image: <img src={`http://127.0.0.1:8000${src.image}`} />
                                                    </div>
                                                )}
                                                {src.file && <div>File:<a href={`http://127.0.0.1:8000${src.file}`}>Download</a></div>}
                                                <button className='ml-1'
                                                    onClick={() => {
                                                        setEditingSourceId(src.id)
                                                        setEditingSourceData(src)
                                                    }}

                                                >Edit</button>
                                                <button
                                                    onClick={() => handleDeleteSource(src)}

                                                >Delete</button>
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
                    You must be logged in to view your useful sources!!!!!
                </div>
            )}
        </>
    )
}

export default UsefulSources