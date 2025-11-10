import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

/**
 * GET: Estadísticas completas de un autor por ID.
 * /api/authors/[id]/stats
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: authorId } = await params
    
    // 1. Verificar existencia del autor
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      select: { name: true, id: true },
    })

    if (!author) {
      return NextResponse.json(
        { error: 'Autor no encontrado' },
        { status: 404 }
      )
    }

    // 2. Obtener libros y realizar agregaciones
    const books = await prisma.book.findMany({
      where: { authorId },
      select: {
        title: true,
        publishedYear: true,
        genre: true,
        pages: true,
      },
      orderBy: {
        publishedYear: 'asc',
      },
    })

    const totalBooks = books.length

    if (totalBooks === 0) {
      return NextResponse.json({
        authorId: author.id,
        authorName: author.name,
        totalBooks: 0,
        message: 'El autor no tiene libros registrados.',
      })
    }
    
    // 3. Procesamiento de Estadísticas
    
    // Libros para calcular min/max y promedio
    const booksWithPages = books.filter(b => b.pages !== null && b.pages > 0)
    
    // Año del primer y último libro
    const firstBook = books[0]
    const latestBook = books[totalBooks - 1]

    // Promedio de páginas
    const totalPagesSum = booksWithPages.reduce((sum, book) => sum + (book.pages || 0), 0)
    const averagePages = booksWithPages.length > 0
      ? Math.round(totalPagesSum / booksWithPages.length)
      : 0

    // Géneros únicos
    const genres = Array.from(new Set(books.map(b => b.genre).filter((g): g is string => !!g)))

    // Libro con más y menos páginas
    const longestBook = booksWithPages.reduce((prev, current) => 
      (current.pages && prev.pages && current.pages > prev.pages) ? current : prev, 
      booksWithPages[0]
    )
    const shortestBook = booksWithPages.reduce((prev, current) => 
      (current.pages && prev.pages && current.pages < prev.pages) ? current : prev, 
      booksWithPages[0]
    )
    
    // 4. Respuesta Final
    return NextResponse.json({
      authorId: author.id,
      authorName: author.name,
      totalBooks,
      firstBook: {
        title: firstBook.title,
        year: firstBook.publishedYear,
      },
      latestBook: {
        title: latestBook.title,
        year: latestBook.publishedYear,
      },
      averagePages,
      genres,
      longestBook: {
        title: longestBook?.title || 'N/A',
        pages: longestBook?.pages || 0,
      },
      shortestBook: {
        title: shortestBook?.title || 'N/A',
        pages: shortestBook?.pages || 0,
      },
    })
  } catch (error) {
    console.error('Error al obtener estadísticas del autor:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas del autor' },
      { status: 500 }
    )
  }
}