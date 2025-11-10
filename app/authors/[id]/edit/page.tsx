import { prisma } from '@/lib/prisma'
import AuthorEditForm from '@/components/AuthorEditForm' 
import Breadcrumbs from '@/components/Breadcrumbs'
import { FaUserEdit } from 'react-icons/fa'

async function getAuthor(authorId: string) {
  const author = await prisma.author.findUnique({
    where: { id: authorId },
  })
  return author
}

export default async function EditAuthorPage({ params }: { params: { id: string } }) {
  const awaitedParams = await params as { id: string };
  const { id } = awaitedParams;
  
  const author = await getAuthor(id)

  if (!author) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Autor no encontrado</h2>
          <p className="text-gray-600">No se pudo encontrar el autor para edición.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs 
          items={[
            { label: 'Autores', href: '/' },
            { label: author.name, href: `/authors/${id}` },
            { label: 'Editar' }
          ]}
        />
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaUserEdit className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <span>Editar Autor: {author.name}</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Actualiza la información del autor
                </p>
              </div>
            </h1>
          </header>
          
          <AuthorEditForm author={author} />
        </div>
      </div>
    </div>
  )
}