// components/BookSearchClient.tsx
'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaSearch, FaFilter, FaSort, FaChevronLeft, FaChevronRight, FaSpinner, FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import Link from 'next/link'

// Tipos (mantener)
interface AuthorSelect { id: string; name: string }
interface Book {
  id: string
  title: string
  genre: string | null
  publishedYear: number | null
  author: { id: string; name: string }
}
interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface SearchResults {
  data: Book[]
  pagination: Pagination
}

const initialParams = {
  search: '',
  genre: '',
  authorName: '',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  order: 'desc',
}

export default function BookSearchClient({ authors, genres }: { authors: AuthorSelect[], genres: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true) // ⬅️ CAMBIADO: Iniciamos en true
  const [results, setResults] = useState<SearchResults>({ 
    data: [], 
    pagination: { 
      page: 1, 
      limit: 10, 
      total: 0, 
      totalPages: 0, 
      hasNext: false, 
      hasPrev: false 
    } 
  })
  
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || initialParams.search,
    genre: searchParams.get('genre') || initialParams.genre,
    authorName: searchParams.get('authorName') || initialParams.authorName,
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    sortBy: searchParams.get('sortBy') || initialParams.sortBy,
    order: searchParams.get('order') || initialParams.order,
  })

  // Función de búsqueda
  const fetchBooks = useCallback(async (params: typeof filters) => {
    setLoading(true)
    const query = new URLSearchParams(params as any).toString()
    
    try {
      const res = await fetch(`/api/books/search?${query}`)
      if (res.ok) {
        const data: SearchResults = await res.json()
        setResults(data)
      } else {
        console.error("Error al cargar la búsqueda:", res.status)
        setResults(prev => ({ data: [], pagination: { ...prev.pagination, total: 0, totalPages: 0 } }))
      }
    } catch (error) {
      console.error("Error de red:", error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // ⬅️ CORRECCIÓN PRINCIPAL: Efecto para cargar datos iniciales al montar
  useEffect(() => {
    fetchBooks(filters)
  }, []) // Solo se ejecuta al montar el componente
  
  // Efecto para sincronizar URL cuando cambian los filtros
  useEffect(() => {
    const query = new URLSearchParams(filters as any).toString()
    router.push(`/books?${query}`, { scroll: false })
  }, [filters, router])

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const newFilters = { 
      ...filters, 
      [name]: value, 
      page: 1 
    }
    setFilters(newFilters)
    fetchBooks(newFilters) // ⬅️ Llamar fetchBooks cuando cambian los filtros
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= results.pagination.totalPages) {
      const newFilters = { ...filters, page: newPage }
      setFilters(newFilters)
      fetchBooks(newFilters)
    }
  }
  
  const handleDeleteBook = async (bookId: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar el libro "${title}"?`)) return
    
    try {
      const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Libro eliminado con éxito.')
        fetchBooks(filters)
      } else {
        const error = await res.json()
        alert(`Error al eliminar: ${error.error}`)
      }
    } catch (error) {
      alert('Error de red al eliminar el libro.')
    }
  }

  return (
    <>
      <header className="mb-8 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaSearch className="text-indigo-600" />
              Catálogo de Libros
            </h1>
            <p className="text-gray-600 mt-1">Explora y gestiona la colección completa</p>
          </div>
          <Link 
            href="/books/create" 
            className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 hover:scale-105"
          >
            <FaPlus className="mr-2" /> Agregar Libro
          </Link>
        </div>
      </header>

      {/* --- Zona de Filtros y Búsqueda --- */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center"><FaFilter className="mr-2 text-indigo-500" /> Opciones de Filtro</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Campo de Búsqueda */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700">Título o Descripción</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                <FaSearch />
              </span>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Buscar por título..."
                value={filters.search}
                onChange={handleInputChange}
                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
              />
            </div>
          </div>
          
          {/* Filtro por Género */}
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Género</label>
            <select
              name="genre"
              id="genre"
              value={filters.genre}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
            >
              <option value="">-- Todos los Géneros --</option>
              {genres.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          
          {/* Filtro por Autor */}
          <div>
            <label htmlFor="authorName" className="block text-sm font-medium text-gray-700">Autor</label>
            <select
              name="authorName"
              id="authorName"
              value={filters.authorName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
            >
              <option value="">-- Todos los Autores --</option>
              {authors.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
            </select>
          </div>
        </div>
        
        {/* Opciones de Ordenamiento */}
        <div className="mt-6 flex items-center space-x-4">
          <FaSort className="text-xl text-indigo-500" />
          <div className='flex items-center space-x-4'>
            <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select
              name="sortBy"
              id="sortBy"
              value={filters.sortBy}
              onChange={handleInputChange}
              className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
            >
              <option value="createdAt">Fecha de Creación</option>
              <option value="title">Título</option>
              <option value="publishedYear">Año de Publicación</option>
            </select>
          </div>
          <div className='flex items-center space-x-4'>
            <label htmlFor="order" className="text-sm font-medium text-gray-700">Orden:</label>
            <select
              name="order"
              id="order"
              value={filters.order}
              onChange={handleInputChange}
              className="rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
            >
              <option value="desc">Descendente</option>
              <option value="asc">Ascendente</option>
            </select>
          </div>
        </div>
      </div>
      {/* ------------------------------------------- */}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados ({results.pagination.total} encontrados)</h2>

      {loading ? (
        <div className="flex justify-center items-center h-48 bg-white rounded-xl shadow-lg">
          <FaSpinner className="animate-spin text-4xl text-indigo-600" />
          <span className="ml-4 text-gray-600">Cargando resultados...</span>
        </div>
      ) : results.data.length === 0 ? (
        <div className="p-10 text-center bg-white rounded-xl shadow-lg">
          <p className="text-lg text-gray-600">No se encontraron libros con los criterios de búsqueda y filtro especificados.</p>
        </div>
      ) : (
        <>
          {/* --- Tabla de Resultados --- */}
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg mb-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Género</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.data.map(book => (
                  <tr key={book.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 hover:text-indigo-800">
                      <Link href={`/authors/${book.author.id}`}>{book.author.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.genre || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publishedYear || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                      <Link href={`/books/${book.id}/edit`} className="text-yellow-600 hover:text-yellow-900">
                        <FaEdit />
                      </Link>
                      <button onClick={() => handleDeleteBook(book.id, book.title)} className="text-red-600 hover:text-red-900">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* --- Paginación --- */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-lg">
            <p className="text-sm text-gray-700">
              Mostrando página <span className="font-medium">{results.pagination.page}</span> de <span className="font-medium">{results.pagination.totalPages}</span> | Total de resultados: <span className="font-medium">{results.pagination.total}</span>
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(results.pagination.page - 1)}
                disabled={!results.pagination.hasPrev || loading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${results.pagination.hasPrev && !loading ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                <FaChevronLeft className="inline mr-1" /> Anterior
              </button>
              <button
                onClick={() => handlePageChange(results.pagination.page + 1)}
                disabled={!results.pagination.hasNext || loading}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition ${results.pagination.hasNext && !loading ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                Siguiente <FaChevronRight className="inline ml-1" />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}