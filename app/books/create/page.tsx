// app/books/create/page.tsx
import { prisma } from '@/lib/prisma'
import BookForm from '@/components/BookForm'
import { FaBookMedical } from 'react-icons/fa'

// Server Component para obtener la lista de autores
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
    <div className="p-8 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaBookMedical className="mr-3 text-indigo-600" /> Registrar Nuevo Libro
        </h1>
      </header>
      
      <BookForm authors={authors} />
    </div>
  )
}