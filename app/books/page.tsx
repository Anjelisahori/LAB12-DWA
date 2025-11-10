// app/books/page.tsx
import { Suspense } from 'react'
import { prisma, getUniqueGenres } from '@/lib/prisma'
import BookSearchClient from '@/components/BookSearchClient'

// Función de Server Component para obtener datos iniciales de la base de datos
async function getInitialData() {
  const authors = await prisma.author.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  })
  const genres = await getUniqueGenres()
  return { authors, genres }
}

export default async function BooksPage() {
  const { authors, genres } = await getInitialData()

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* ⚡ Envuelve el componente cliente dentro de Suspense */}
      <Suspense fallback={<div className="text-gray-500">Cargando libros...</div>}>
        <BookSearchClient authors={authors} genres={genres} />
      </Suspense>
    </div>
  )
}
