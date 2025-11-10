import { prisma } from '@/lib/prisma'
import AuthorEditForm from '@/components/AuthorEditForm' 
import { FaUserEdit } from 'react-icons/fa'

async function getAuthor(authorId: string) {
  const author = await prisma.author.findUnique({
    where: { id: authorId },
  })
  return author
}

export default async function EditAuthorPage({ params }: { params: { id: string } }) {
  // CORRECCIÓN CLAVE: Hacemos 'await' a params antes de desestructurar.
  // Esto resuelve el error de "params is a Promise".
  const awaitedParams = await params as { id: string };
  const { id } = awaitedParams;
  
  const author = await getAuthor(id)

  if (!author) {
    return <div className="p-8 text-center text-red-500">Autor no encontrado para edición.</div>
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen max-w-3xl mx-auto">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaUserEdit className="mr-3 text-indigo-600" /> Editar Autor: {author.name}
        </h1>
      </header>
      
      <AuthorEditForm author={author} />
    </div>
  )
}