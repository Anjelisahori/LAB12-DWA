// app/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { AuthorCard } from '@/components/AuthorCard'
import { FaPlus, FaSearch, FaUser } from 'react-icons/fa'

// Obtener autores y estadísticas generales (Server Side)
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
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-10 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          <FaUser className="mr-3 text-indigo-600" /> Dashboard Empresarial de la Biblioteca
        </h1>
        <div className="flex space-x-4">
          <Link href="/books" className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg shadow-md hover:bg-gray-800 transition">
            <FaSearch className="mr-2" /> Buscar y Gestionar Libros
          </Link>
          <Link href="/authors/create" className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
            <FaPlus className="mr-2" /> Crear Autor
          </Link>
        </div>
      </header>

      {/* --- Sección de Estadísticas Generales --- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500">
          <p className="text-sm font-medium text-gray-500">Autores Registrados</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{totalAuthors}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-teal-500">
          <p className="text-sm font-medium text-gray-500">Libros en la Colección</p>
          <p className="text-4xl font-bold text-gray-900 mt-1">{totalBooks}</p>
        </div>
      </section>
      {/* ------------------------------------------- */}

      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Gestión de Autores ({authors.length})</h2>
      
      {authors.length === 0 ? (
        <p className="text-gray-600 p-4 bg-white rounded-lg shadow-inner">No hay autores registrados. ¡Crea uno para empezar!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {authors.map(author => (
            <AuthorCard key={author.id} author={author} />
          ))}
        </div>
      )}
    </div>
  )
}