'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaEdit, FaTrash } from 'react-icons/fa'

interface BookActionsProps {
  bookId: string
  bookTitle: string
}

/**
 * Componente de cliente que maneja las acciones de Editar y Eliminar para un libro.
 */
export const BookActions = ({ bookId, bookTitle }: BookActionsProps) => {
  const router = useRouter()

  const handleDelete = async () => {
    // 1. Confirmación de usuario antes de proceder
    if (!confirm(`¿Estás seguro de eliminar el libro "${bookTitle}"? Esta acción es irreversible.`)) return
    
    try {
      // 2. Ejecutar la petición DELETE a la API de libros (ej: /api/books/cmhr2pmf30002v0yw9ljaahzq)
      const res = await fetch(`/api/books/${bookId}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        // 3. ÉXITO: Recargar la página para que el libro desaparezca de la tabla
        alert(`Libro "${bookTitle}" eliminado con éxito.`)
        router.refresh() 
      } else {
        // 4. ERROR: Manejar posibles errores del servidor (ej. 404 si ya no existe)
        const error = await res.json()
        
        if (res.status === 404) {
            alert(`El libro ya había sido eliminado o no existe. Recargando lista.`)
            router.refresh() 
        } else {
            alert(`Error al eliminar el libro: ${error.error || 'Error desconocido'}`)
        }
      }
    } catch (error) {
      console.error("Error de red o inesperado:", error);
      alert('Error de red al intentar eliminar el libro.')
    }
  }

  return (
    <div className="flex space-x-3">
      {/* Botón Editar Libro (Enlace al formulario de edición) */}
      <Link 
        href={`/books/${bookId}/edit`} 
        className="p-2 text-yellow-600 hover:text-yellow-800 transition duration-150"
      >
        <FaEdit title="Editar Libro" className="w-5 h-5" />
      </Link>
      
      {/* Botón ELIMINAR Libro (Botón con onClick para la lógica de eliminación) */}
      <button 
        onClick={handleDelete} 
        className="p-2 text-red-600 hover:text-red-800 transition duration-150"
      >
        <FaTrash title="Eliminar Libro" className="w-5 h-5" />
      </button>
    </div>
  )
}