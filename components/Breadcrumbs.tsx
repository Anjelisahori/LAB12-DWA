// components/Breadcrumbs.tsx
'use client'
import Link from 'next/link'
import { FaHome, FaChevronRight } from 'react-icons/fa'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6 bg-white px-4 py-3 rounded-lg shadow-sm">
      <Link 
        href="/" 
        className="flex items-center text-gray-600 hover:text-indigo-600 transition"
      >
        <FaHome className="mr-1" />
        <span>Inicio</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <FaChevronRight className="text-gray-400 text-xs" />
          {item.href ? (
            <Link 
              href={item.href}
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}