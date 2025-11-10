import { prisma } from '@/lib/prisma'
import { FaBook, FaCalendarAlt, FaChartBar, FaPencilAlt, FaChartBar as FaChartBarIcon, FaArrowLeft } from 'react-icons/fa'
import Link from 'next/link'
import AuthorEditForm from '@/components/AuthorEditForm' 

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
  const awaitedParams = await params as { id: string };
  const { id } = awaitedParams;
  
  const { author, stats } = await getAuthorAndStats(id)

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Autor no encontrado</h2>
          <Link href="/" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-2">
            <FaArrowLeft />
            Volver al Dashboard
          </Link>
        </div>
      </div>
    )
  }

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
            <div className="md:col-span-2 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-3">Géneros Principales:</p>
                <div className="flex flex-wrap gap-2">
                    {stats.genres.map(genre => (
                        <span key={genre} className="px-4 py-2 text-sm font-semibold text-indigo-700 bg-white rounded-full shadow-sm border border-indigo-200">
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con navegación */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{author.name}</h1>
            <p className="text-gray-600">{author.email}</p>
          </div>
          <Link 
            href={`/books/create?authorId=${author.id}`} 
            className="flex items-center px-5 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <FaBook className="mr-2" /> Agregar Libro
          </Link>
        </div>

        {/* Grid de contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Formulario de edición */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-lg h-fit">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 flex items-center border-b pb-3">
              <FaPencilAlt className="mr-2"/> Editar Información
            </h2>
            <AuthorEditForm author={author} /> 
          </div>

          {/* Estadísticas */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 flex items-center border-b pb-3">
              <FaChartBar className="mr-2"/> Estadísticas de Publicación
            </h2>
            {renderStats()}
          </div>
        </div>

        {/* Lista de libros */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FaBook className="text-indigo-600" />
              Libros Publicados
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({author.books.length})
              </span>
            </h2>
          </div>
          
          {author.books.length === 0 ? (
            <div className="p-10 text-center">
              <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-lg text-gray-600 mb-4">Este autor aún no tiene libros registrados</p>
              <Link 
                href={`/books/create?authorId=${author.id}`}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <FaBook className="mr-2" />
                Agregar primer libro
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Género</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Páginas</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {author.books.map((book) => (
                    <tr key={book.id} className="hover:bg-indigo-50 transition duration-150">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{book.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{book.genre || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{book.pages || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{book.publishedYear || 'N/A'}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <Link 
                          href={`/books/${book.id}/edit`} 
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const StatBox = ({ icon, title, value, subtitle, color }: { icon: React.ReactNode, title: string, value: string | number, subtitle?: string, color: 'blue' | 'green' | 'yellow' | 'purple' }) => {
  const colorMap = {
    blue: 'border-blue-500 bg-blue-50',
    green: 'border-green-500 bg-green-50',
    yellow: 'border-yellow-500 bg-yellow-50',
    purple: 'border-purple-500 bg-purple-50',
  };
  const iconColorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
  };
  return (
    <div className={`${colorMap[color]} p-5 rounded-lg border-l-4 flex items-center shadow-sm hover:shadow-md transition-shadow`}>
      <div className={`text-3xl ${iconColorMap[color]} mr-4`}>{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 truncate mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}