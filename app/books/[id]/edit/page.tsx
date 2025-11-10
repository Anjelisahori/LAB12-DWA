import { prisma } from '@/lib/prisma'
import BookForm from '@/components/BookForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import { FaEdit } from 'react-icons/fa'

interface AuthorSelect { id: string; name: string }

async function getBookAndAuthors(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  })
  
  const authors = await prisma.author.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })
  
  return { book, authors }
}

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params as { id: string };
  const { id } = awaitedParams;
  
  const { book, authors } = await getBookAndAuthors(id)

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Libro no encontrado</h2>
          <p className="text-gray-600">No se pudo encontrar el libro para edición.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs 
          items={[
            { label: 'Libros', href: '/books' },
            { label: book.title },
            { label: 'Editar' }
          ]}
        />
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaEdit className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <span>Editar: {book.title}</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Actualiza la información del libro
                </p>
              </div>
            </h1>
          </header>
          
          <BookForm book={book} authors={authors} />
        </div>
      </div>
    </div>
  )
}