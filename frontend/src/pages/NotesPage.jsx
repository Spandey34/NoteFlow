import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../component/Modal'; // Import the new Modal component

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

// Reusable button component for consistency
const Button = ({ onClick, children, className, type = 'button' }) => (
  <button type={type} onClick={onClick} className={`w-full font-semibold py-2 rounded-md transition duration-300 ${className}`}>
    {children}
  </button>
);

export default function NotesPage({ token, onLogout }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  
  const api = axios.create({
    baseURL: BACKEND_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchNotes = async () => {
    try {
      const response = await api.get('/api/notes');
      setNotes(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch notes.');
    }
  };

  useEffect(() => { fetchNotes() }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/notes', { title, content });
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create note.');
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/notes/${editingNote._id}`, { title: editingNote.title, content: editingNote.content });
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      setError('Failed to update note.');
    }
  };
  
  const handleDeleteNote = async () => {
    try {
      await api.delete(`/api/notes/${noteToDelete._id}`);
      setNoteToDelete(null);
      fetchNotes();
    } catch (err) {
      setError('Failed to delete note.');
      setNoteToDelete(null);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-gray-800">Note<span className="text-blue-600">Flow</span></h1>
          <button onClick={onLogout} className="text-sm font-medium text-gray-600 hover:text-red-600">Logout</button>
        </div>
      </header>
      
      <main className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Create Note Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Add a Note</h3>
          <form onSubmit={handleCreateNote} className="space-y-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required className="w-full p-2 border rounded-md"/>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required rows="4" className="w-full p-2 border rounded-md"/>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Create Note</Button>
          </form>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
          {error.includes('limit reached') && (
            <Button className="mt-2 bg-green-500 text-white hover:bg-green-600">Upgrade to Pro</Button>
          )}
        </div>

        {/* Notes List */}
        <div className="md:col-span-2 space-y-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-start">
              <div className="pr-4">
                <strong className="block font-semibold">{note.title}</strong>
                <p className="text-gray-600">{note.content}</p>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => setEditingNote(note)} className="text-gray-400 hover:text-blue-500">Edit</button>
                <button onClick={() => setNoteToDelete(note)} className="text-gray-400 hover:text-red-500">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Modal */}
      {editingNote && (
        <Modal onCancel={() => setEditingNote(null)}>
          <h3 className="text-xl font-semibold mb-4">Edit Note</h3>
          <form onSubmit={handleUpdateNote} className="space-y-4">
            <input value={editingNote.title} onChange={(e) => setEditingNote({...editingNote, title: e.target.value})} className="w-full p-2 border rounded-md"/>
            <textarea value={editingNote.content} onChange={(e) => setEditingNote({...editingNote, content: e.target.value})} rows="4" className="w-full p-2 border rounded-md"/>
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setEditingNote(null)} className="w-auto px-4 bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
              <Button type="submit" className="w-auto px-4 bg-blue-600 text-white hover:bg-blue-700">Save</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {noteToDelete && (
        <Modal onCancel={() => setNoteToDelete(null)}>
          <h3 className="text-xl font-semibold mb-2">Confirm Deletion</h3>
          <p className="text-gray-600 mb-4">Are you sure you want to delete this note?</p>
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setNoteToDelete(null)} className="w-auto px-4 bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
            <Button onClick={handleDeleteNote} className="w-auto px-4 bg-red-600 text-white hover:bg-red-700">Delete</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}