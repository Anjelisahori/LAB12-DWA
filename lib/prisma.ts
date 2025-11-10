// lib/prisma.ts (CÓDIGO CORREGIDO ✅)

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Exportación de la instancia prisma (Necesaria para API Routes y CRUD)
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Función helper para obtener una lista de géneros únicos.
 * Esto se usa para poblar los filtros en el frontend.
 */
export async function getUniqueGenres() {
  // Usamos distinct en el campo genre para obtener solo los valores únicos
  const uniqueGenres = await prisma.book.findMany({
    select: {
      genre: true,
    },
    distinct: ['genre'],
    where: {
      genre: {
        notIn: [null, ''], // ✅ Corrección: evita duplicar la clave 'not'
      },
    },
    orderBy: {
      genre: 'asc',
    },
  })

  // Devuelve un array de strings (géneros)
  return uniqueGenres
    .map(item => item.genre)
    .filter((genre): genre is string => !!genre)
}
