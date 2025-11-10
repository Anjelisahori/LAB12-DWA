// app/authors/create/page.tsx
import AuthorEditForm from '@/components/AuthorEditForm'
import { FaUserPlus } from 'react-icons/fa'

// Esta es una página de Client Component (porque AuthorEditForm es 'use client')
export default function CreateAuthorPage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen max-w-3xl mx-auto">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <FaUserPlus className="mr-3 text-indigo-600" /> Nuevo Autor
        </h1>
      </header>
      
      <AuthorEditForm />
    </div>
  )
}