'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FaEdit, FaTrash, FaBook } from 'react-icons/fa'

interface Author {
  id: string
  name: string
  email: string
  _count: { books: number }
}

export const AuthorCard = ({ author }: { author: Author }) => {
  const router = useRouter()

  const handleDelete = async () => {
    // 1. Confirmación de usuario (IMPORTANTE: Se usó 'confirm()' en el código original)
    if (!confirm(`¿Estás seguro de eliminar a ${author.name}? Esto eliminará también sus libros y es irreversible.`)) return
    
    try {
      // 2. Ejecutar la petición DELETE a la API
      const res = await fetch(`/api/authors/${author.id}`, { method: 'DELETE' })
      
      if (res.ok) {
        // 3. ÉXITO: Mensaje de éxito y forzar recarga de la página
        alert('Autor eliminado con éxito.')
        router.refresh() 
      } else {
        // 4. ERROR: Manejar la respuesta del error (ej. 404 si ya se eliminó)
        const error = await res.json()
        
        // Si el error es 404 (no encontrado), asumimos que ya se eliminó y recargamos
        if (res.status === 404) {
            alert(`El autor ya había sido eliminado o no existe. Recargando lista.`)
            router.refresh() 
        } else {
            alert(`Error al eliminar: ${error.error}`)
        }
      }
    } catch (error) {
      console.error("Error de red o inesperado:", error);
      alert('Error de red al intentar eliminar el autor.')
    }
  }

  return (
    <div className="bg-white p-6 shadow-lg rounded-lg border border-gray-100 hover:shadow-xl transition duration-300 flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{author.name}</h3>
        <p className="text-sm text-gray-500 mt-1">{author.email}</p>
        <p className="text-md font-medium text-indigo-600 mt-3">Libros: {author._count.books}</p>
      </div>
      <div className="mt-4 flex space-x-2">
        {/* Botón Ver Detalle (Azul) */}
        <Link href={`/authors/${author.id}`} className="p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition">
          <FaBook title="Ver Detalle y Libros" />
        </Link>
        {/* Botón Editar Autor (Amarillo) */}
        <Link href={`/authors/${author.id}/edit`} className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition">
          <FaEdit title="Editar Autor" />
        </Link>
        {/* Botón ELIMINAR (Rojo) - Llama a la función handleDelete */}
        <button onClick={handleDelete} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition">
          <FaTrash title="Eliminar Autor" />
        </button>
      </div>
    </div>
  )
}