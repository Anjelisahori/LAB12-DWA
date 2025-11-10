import { prisma } from '@/lib/prisma'
import BookForm from '@/components/BookForm'
import { FaEdit } from 'react-icons/fa'

// Tipado para los selectores de autor
interface AuthorSelect { id: string; name: string }

// Server Component para obtener el libro a editar y la lista de autores
async function getBookAndAuthors(bookId: string) {
  // bookId es la string del ID limpia y válida
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
  // CORRECCIÓN CLAVE:
  // Hacemos 'await' a params para resolver la Promise (en tu entorno Next.js/Turbopack)
  // antes de usar el ID. Esto soluciona el error de Prisma.
  const awaitedParams = await params as { id: string };
  const { id } = awaitedParams;
  
  const { book, authors } = await getBookAndAuthors(id)

  if (!book) {
    return <div className="p-8 text-center text-red-500">Libro no encontrado.</div>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen max-w-4xl mx-auto">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaEdit className="mr-3 text-indigo-600" /> Editar: {book.title}
        </h1>
      </header>
      
      {/* Usamos el formulario compartido para edición */}
      <BookForm book={book} authors={authors} />
    </div>
  )
}