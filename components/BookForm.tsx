// components/BookForm.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaBook, FaGlobe, FaCalendarAlt, FaHashtag } from 'react-icons/fa'

interface AuthorSelect { id: string; name: string }
interface Book {
    id: string
    title: string
    description: string | null
    isbn: string | null
    publishedYear: number | null
    genre: string | null
    pages: number | null
    authorId: string
}

interface BookFormData extends Omit<Book, 'id'> {}

const initialFormData: BookFormData = {
  title: '',
  description: '',
  isbn: '',
  publishedYear: null,
  genre: '',
  pages: null,
  authorId: '',
}

export default function BookForm({ book, authors }: { book?: Book, authors: AuthorSelect[] }) {
  const router = useRouter()
  const [formData, setFormData] = useState<BookFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const isEditing = !!book

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        description: book.description || '',
        isbn: book.isbn || '',
        publishedYear: book.publishedYear || null,
        genre: book.genre || '',
        pages: book.pages || null,
        authorId: book.authorId,
      })
    }
  }, [book])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'publishedYear' || name === 'pages') ? (value ? parseInt(value) : null) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const url = isEditing ? `/api/books/${book!.id}` : '/api/books'
    const method = isEditing ? 'PUT' : 'POST'
    
    // Asegurarse de que authorId esté seteado si es un nuevo libro
    if (!isEditing && !formData.authorId) {
        alert('Por favor, selecciona un autor.')
        setLoading(false)
        return
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const result = await res.json()
        alert(`Libro ${isEditing ? 'actualizado' : 'creado'} con éxito!`)
        router.push(isEditing ? `/books` : `/authors/${result.authorId}`)
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Error: ${error.error || 'Ocurrió un error en la solicitud.'}`)
      }
    } catch (error) {
      alert('Error de red al procesar el formulario.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-600 border-b pb-2">{isEditing ? `Editar Libro: ${book?.title}` : 'Crear Nuevo Libro'}</h2>
      
      {/* Selector de Autor (Requerido para POST) */}
      <div>
        <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">Autor (*)</label>
        <select name="authorId" id="authorId" required={!isEditing} disabled={isEditing} value={formData.authorId} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-gray-50 disabled:bg-gray-200">
          <option value="">-- Seleccionar Autor --</option>
          {authors.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {isEditing && <p className="text-xs text-gray-500 mt-1">El autor no puede ser cambiado en modo edición.</p>}
      </div>
      
      {/* Campos Principales */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título (*)</label>
        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" id="description" rows={3} value={formData.description || ''} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"></textarea>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* ISBN */}
        <div>
          <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 flex items-center"><FaHashtag className="mr-1"/> ISBN</label>
          <input type="text" name="isbn" id="isbn" value={formData.isbn || ''} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        {/* Año de Publicación */}
        <div>
          <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 flex items-center"><FaCalendarAlt className="mr-1"/> Año Pub.</label>
          <input type="number" name="publishedYear" id="publishedYear" value={formData.publishedYear || ''} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        {/* Género */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 flex items-center"><FaGlobe className="mr-1"/> Género</label>
          <input type="text" name="genre" id="genre" value={formData.genre || ''} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        {/* Páginas */}
        <div>
          <label htmlFor="pages" className="block text-sm font-medium text-gray-700 flex items-center"><FaBook className="mr-1"/> Páginas</label>
          <input type="number" name="pages" id="pages" value={formData.pages || ''} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
      </div>

      <div className="pt-4">
        <button type="submit" disabled={loading}
          className={`flex items-center px-6 py-2 rounded-lg text-white font-medium transition ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          <FaSave className="mr-2" />
          {loading ? 'Procesando...' : isEditing ? 'Actualizar Libro' : 'Crear Libro'}
        </button>
      </div>
    </form>
  )
}