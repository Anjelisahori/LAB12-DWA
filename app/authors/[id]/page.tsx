import { prisma } from '@/lib/prisma'
import { FaBook, FaCalendarAlt, FaChartBar, FaGlobe, FaPencilAlt, FaTrash, FaChartBar as FaChartBarIcon } from 'react-icons/fa'
import Link from 'next/link'
import AuthorEditForm from '@/components/AuthorEditForm' 

// Tipado para la respuesta de estadísticas 
interface AuthorStats {
  authorId: string; authorName: string; totalBooks: number;
  firstBook?: { title: string; year: number };
  latestBook?: { title: string; year: number };
  averagePages: number; genres: string[];
  longestBook?: { title: string; pages: number };
  shortestBook?: { title: string; pages: number };
}

async function getAuthorAndStats(authorId: string) {
  const author = await prisma.author.findUnique({
    where: { id: authorId },
    include: {
      books: {
        orderBy: { publishedYear: 'desc' },
        select: { id: true, title: true, publishedYear: true, pages: true, genre: true }
      }
    }
  })

  if (!author) return { author: null, stats: null }

  // Consumir el endpoint de estadísticas (/api/authors/[id]/stats)
  // Usamos localhost ya que es un fetch interno en desarrollo
  const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/authors/${authorId}/stats`, { 
      cache: 'no-store' 
  })
  
  let stats: AuthorStats | null = null;
  if (statsResponse.ok) {
    stats = await statsResponse.json();
  }
  
  return { author, stats }
}

export default async function AuthorDetailPage({ params }: { params: { id: string } }) {
  // CORRECCIÓN CLAVE: Hacemos 'await' a params antes de desestructurar.
  const awaitedParams = await params as { id: string };
  const { id } = awaitedParams;
  
  const { author, stats } = await getAuthorAndStats(id)

  if (!author) {
    return <div className="p-8 text-center text-red-500">Autor no encontrado.</div>
  }

  // --- Renderizado de estadísticas (manteniendo la función interna) ---

  const renderStats = () => {
    if (!stats) {
        return <p className="text-gray-500">No se pudieron cargar las estadísticas.</p>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatBox 
                icon={<FaBook />} 
                title="Total de Libros" 
                value={stats.totalBooks} 
                color="blue" 
            />
            <StatBox 
                icon={<FaChartBarIcon />} 
                title="Páginas Promedio" 
                value={stats.averagePages.toFixed(0)} 
                color="green" 
            />
            {stats.firstBook && (
                <StatBox 
                    icon={<FaCalendarAlt />} 
                    title="Primer Libro" 
                    value={stats.firstBook.title} 
                    subtitle={`Publicado en ${stats.firstBook.year}`}
                    color="yellow" 
                />
            )}
            {stats.longestBook && (
                <StatBox 
                    icon={<FaPencilAlt />} 
                    title="Libro Más Largo" 
                    value={`${stats.longestBook.pages} págs.`}
                    subtitle={stats.longestBook.title}
                    color="purple" 
                />
            )}
            <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-700 mb-2">Géneros Principales:</p>
                <div className="flex flex-wrap gap-2">
                    {stats.genres.map(genre => (
                        <span key={genre} className="px-3 py-1 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  // --- Fin del renderizado de estadísticas ---


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <header className="mb-8 border-b pb-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">{author.name}</h1>
        <Link href={`/books/create?authorId=${author.id}`} className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <FaBook className="mr-2" /> Agregar Nuevo Libro
        </Link>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg h-fit">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center"><FaPencilAlt className="mr-2"/> Editar Información</h2>
          <AuthorEditForm author={author} /> 
        </div>

        {/* Bloque de estadísticas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center"><FaChartBar className="mr-2"/> Estadísticas de Publicación</h2>
          {renderStats()}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Libros Publicados ({author.books.length})</h2>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Género</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Páginas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {author.books.map((book) => (
                        <tr key={book.id} className="hover:bg-indigo-50 transition duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                <Link href={`/books/${book.id}`} className="text-indigo-600 hover:text-indigo-800">
                                    {book.title}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{book.genre}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">{book.pages}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.publishedYear}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Link href={`/books/${book.id}/edit`} className="text-yellow-600 hover:text-yellow-800 mr-4 inline-flex items-center">
                                    <FaPencilAlt className="mr-1" /> Editar
                                </Link>
                                {/* El botón de eliminar requeriría una Server Action separada, pero por simplicidad de rutas, no lo implementamos aquí. */}
                                <button className="text-red-600 hover:text-red-800 inline-flex items-center">
                                    <FaTrash className="mr-1" /> Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {author.books.length === 0 && (
                <div className="p-6 text-center text-gray-500">Este autor aún no tiene libros registrados.</div>
            )}
        </div>
      </section>
    </div>
  )
}

// StatBox component (requerido)
const StatBox = ({ icon, title, value, subtitle, color }: { icon: React.ReactNode, title: string, value: string | number, subtitle?: string, color: 'blue' | 'green' | 'yellow' | 'purple' }) => {
  const colorMap = {
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    yellow: 'border-yellow-500 text-yellow-600',
    purple: 'border-purple-500 text-purple-600',
  };
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${colorMap[color]} flex items-center`}>
      <div className={`text-2xl ${colorMap[color].split(' ')[1]} mr-4`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 truncate">{subtitle}</p>}
      </div>
    </div>
  )
}