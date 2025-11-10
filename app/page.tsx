// app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { AuthorCard } from '@/components/AuthorCard'
import { FaPlus, FaSearch, FaBook, FaUser, FaChartBar } from 'react-icons/fa'

async function getDashboardData() {
  const authors = await prisma.author.findMany({
    include: {
      _count: { select: { books: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const totalAuthors = await prisma.author.count()
  const totalBooks = await prisma.book.count()

  return { authors, totalAuthors, totalBooks }
}

export default async function DashboardPage() {
  const { authors, totalAuthors, totalBooks } = await getDashboardData()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header con título y acciones */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                <FaChartBar className="text-indigo-600" />
                Dashboard de Biblioteca
              </h1>
              <p className="mt-2 text-gray-600">
                Gestiona autores, libros y estadísticas de tu biblioteca
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link 
                href="/books" 
                className="flex items-center px-5 py-3 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition-all duration-200 hover:scale-105"
              >
                <FaSearch className="mr-2" />
                <span>Explorar Libros</span>
              </Link>
              <Link 
                href="/authors/create" 
                className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 hover:scale-105"
              >
                <FaPlus className="mr-2" />
                <span>Nuevo Autor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium uppercase tracking-wide">
                  Autores Registrados
                </p>
                <p className="text-5xl font-bold mt-2">{totalAuthors}</p>
                <p className="text-indigo-100 text-sm mt-2">
                  {authors.length > 0 ? `Último agregado: ${authors[0].name}` : 'Sin autores aún'}
                </p>
              </div>
              <FaUser className="text-6xl text-indigo-300 opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-8 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm font-medium uppercase tracking-wide">
                  Libros en Colección
                </p>
                <p className="text-5xl font-bold mt-2">{totalBooks}</p>
                <p className="text-teal-100 text-sm mt-2">
                  Total de obras catalogadas
                </p>
              </div>
              <FaBook className="text-6xl text-teal-300 opacity-50" />
            </div>
          </div>
        </div>

        {/* Sección de Autores */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-indigo-600" />
              Gestión de Autores
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({authors.length})
              </span>
            </h2>
          </div>
          
          {authors.length === 0 ? (
            <div className="text-center py-16">
              <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 text-lg mb-6">
                No hay autores registrados aún
              </p>
              <Link 
                href="/authors/create"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-105"
              >
                <FaPlus className="mr-2" />
                Crear tu primer autor
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {authors.map(author => (
                <AuthorCard key={author.id} author={author} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}