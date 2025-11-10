import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

// Definiciones de tipos para asegurar tipado estricto
type SortBy = 'title' | 'publishedYear' | 'createdAt'
type Order = 'asc' | 'desc'

/**
 * GET: Búsqueda de libros con filtros y paginación.
 * /api/books/search?search=...&genre=...&authorName=...&page=...&limit=...&sortBy=...&order=...
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // 1. Obtener y validar Query Parameters
    const search = searchParams.get('search') || ''
    const genre = searchParams.get('genre')
    const authorName = searchParams.get('authorName')
    
    // Paginación
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Max 50
    const skip = (page - 1) * limit
    
    // Ordenamiento
    const sortBy: SortBy = (searchParams.get('sortBy') as SortBy) || 'createdAt'
    const order: Order = (searchParams.get('order') as Order) || 'desc'

    // Validación simple de parámetros de ordenamiento
    const validSortFields: SortBy[] = ['title', 'publishedYear', 'createdAt']
    const validOrder: Order[] = ['asc', 'desc']
    if (!validSortFields.includes(sortBy) || !validOrder.includes(order)) {
      return NextResponse.json({ error: 'Parámetros de ordenamiento inválidos' }, { status: 400 })
    }

    // 2. Construir la cláusula WHERE de Prisma
    const where: Prisma.BookWhereInput = {}
    
    // Búsqueda por título (case-insensitive, búsqueda parcial)
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive', // PostgreSQL only
      }
    }
    
    // Filtro por género exacto
    if (genre) {
      where.genre = genre
    }
    
    // Búsqueda por nombre de autor (case-insensitive, búsqueda parcial)
    if (authorName) {
      where.author = {
        name: {
          contains: authorName,
          mode: 'insensitive', // PostgreSQL only
        },
      }
    }

    // 3. Consultar Total de Registros (para paginación)
    const total = await prisma.book.count({ where })

    // 4. Consultar los Libros
    const books = await prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order,
      },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    })
    
    // 5. Calcular la Paginación
    const totalPages = Math.ceil(total / limit)
    const hasNext = page < totalPages
    const hasPrev = page > 1

    return NextResponse.json({
      data: books,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    })
  } catch (error) {
    console.error('Error en búsqueda avanzada de libros:', error)
    return NextResponse.json(
      { error: 'Error al realizar la búsqueda avanzada de libros' },
      { status: 500 }
    )
  }
}