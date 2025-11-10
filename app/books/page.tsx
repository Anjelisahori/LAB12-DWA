// app/books/page.tsx
import { prisma, getUniqueGenres } from '@/lib/prisma'
import BookSearchClient from '@/components/BookSearchClient'

// Función de Server Component para obtener datos iniciales de la base de datos
async function getInitialData() {
  const authors = await prisma.author.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
  // Usamos la función helper de prisma.ts
  const genres = await getUniqueGenres() 

  // Nota: Si no hay autores, la lista estará vacía, lo cual es manejado en el cliente.
  return { authors, genres }
}

export default async function BooksPage() {
  const { authors, genres } = await getInitialData()

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Pasa los datos estáticos al componente de cliente para que maneje la interactividad */}
      <BookSearchClient authors={authors} genres={genres} />
    </div>
  )
}