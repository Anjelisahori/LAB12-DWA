// lib/prisma.ts (CÓDIGO CORREGIDO)

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Exportación de la instancia prisma (NEcesaria para API Routes y CRUD)
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Función helper para obtener una lista de géneros únicos.
 * Esto se usa para poblar los filtros en el frontend.
 */
// Asegúrate de que esta función también tenga 'export'
export async function getUniqueGenres() { 
  // Usamos distinct en el campo genre para obtener solo los valores únicos
  const uniqueGenres = await prisma.book.findMany({
    select: {
      genre: true,
    },
    distinct: ['genre'],
    where: {
      genre: {
        not: null, // Ignorar los registros con género nulo
        not: '',   // Ignorar los registros con género vacío
      }
    },
    orderBy: {
      genre: 'asc',
    }
  })

  // Devuelve un array de strings (géneros)
  return uniqueGenres.map(item => item.genre).filter((genre): genre is string => !!genre);
}