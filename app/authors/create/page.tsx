// app/authors/create/page.tsx
import AuthorEditForm from '@/components/AuthorEditForm'
import Breadcrumbs from '@/components/Breadcrumbs'
import { FaUserPlus } from 'react-icons/fa'

export default function CreateAuthorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs 
          items={[
            { label: 'Autores', href: '/' },
            { label: 'Nuevo Autor' }
          ]}
        />
        
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <header className="mb-8 border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <FaUserPlus className="text-indigo-600 text-2xl" />
              </div>
              <div>
                <span>Registrar Nuevo Autor</span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Completa la información del autor para agregarlo al sistema
                </p>
              </div>
            </h1>
          </header>
          
          <AuthorEditForm />
        </div>
      </div>
    </div>
  )
}