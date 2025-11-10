// components/AuthorEditForm.tsx
'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaTrash, FaGlobe, FaCalendarAlt } from 'react-icons/fa'

interface Author {
  id: string
  name: string
  email: string
  bio: string | null
  nationality: string | null
  birthYear: number | null
}

const initialFormData: Omit<Author, 'id'> = {
  name: '',
  email: '',
  bio: '',
  nationality: '',
  birthYear: null,
}

export default function AuthorEditForm({ author }: { author?: Author }) {
  const router = useRouter()
  const [formData, setFormData] = useState<typeof initialFormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const isEditing = !!author

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name,
        email: author.email,
        bio: author.bio || '',
        nationality: author.nationality || '',
        birthYear: author.birthYear || null,
      })
    }
  }, [author])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'birthYear' ? (value ? parseInt(value) : null) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const url = isEditing ? `/api/authors/${author!.id}` : '/api/authors'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const result = await res.json()
        alert(`Autor ${isEditing ? 'actualizado' : 'creado'} con éxito!`)
        // Redirige al dashboard o al detalle del autor actualizado
        router.push(isEditing ? `/authors/${result.id}` : '/') 
        router.refresh() // Recargar datos del Server Component
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

  const handleDelete = async () => {
    if (!author || !confirm(`¿Estás seguro de eliminar a ${author.name}? Esta acción es irreversible y eliminará todos sus libros.`)) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/authors/${author.id}`, { method: 'DELETE' })
      
      if (res.ok) {
        alert('Autor eliminado con éxito.')
        router.push('/') // Volver al dashboard
        router.refresh()
      } else {
        const error = await res.json()
        alert(`Error al eliminar: ${error.error}`)
      }
    } catch (error) {
      alert('Error de red al eliminar el autor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{isEditing ? `Editar a ${author?.name}` : 'Crear Nuevo Autor'}</h3>
      
      {/* Campos de Nombre, Email, Biografía */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre Completo (*)</label>
        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email (*)</label>
        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Biografía</label>
        <textarea name="bio" id="bio" rows={3} value={formData.bio || ''} onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"></textarea>
      </div>

      {/* Campos de Nacionalidad y Año de Nacimiento */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nationality" className="block text-sm font-medium text-gray-700 flex items-center"><FaGlobe className="mr-1"/> Nacionalidad</label>
          <input type="text" name="nationality" id="nationality" value={formData.nationality || ''} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
        <div>
          <label htmlFor="birthYear" className="block text-sm font-medium text-gray-700 flex items-center"><FaCalendarAlt className="mr-1"/> Año de Nacimiento</label>
          <input type="number" name="birthYear" id="birthYear" value={formData.birthYear || ''} onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between pt-4">
        <button type="submit" disabled={loading}
          className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition ${loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          <FaSave className="mr-2" />
          {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Autor'}
        </button>
        
        {isEditing && (
          <button type="button" onClick={handleDelete} disabled={loading}
            className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>
            <FaTrash className="mr-2" />
            Eliminar Autor
          </button>
        )}
      </div>
    </form>
  )
}