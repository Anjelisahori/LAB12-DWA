// app/books/create/page.tsx
import { prisma } from '@/lib/prisma'
import BookForm from '@/components/BookForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import { FaBookMedical } from 'react-icons/fa'

async function getAuthors() {
  const authors = await prisma.author.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
  return authors
}

export default async function CreateBookPage() {
  const authors = await getAuthors()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs 
          items={[
            { label: 'Libros', href: '/books' },
            { label: 'Nuevo Libro' }
          ]}
        />
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaBookMedical className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <span>Registrar Nuevo Libro</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Agrega un nuevo libro a la colección de la biblioteca
                </p>
              </div>
            </h1>
          </header>
          
          {authors.length === 0 ? (
            <div className="text-center py-10 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 font-semibold mb-2">⚠️ No hay autores registrados</p>
              <p className="text-yellow-700 text-sm">
                Debes crear al menos un autor antes de agregar libros
              </p>
            </div>
          ) : (
            <BookForm authors={authors} />
          )}
        </div>
      </div>
    </div>
  )
}