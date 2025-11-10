'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaBook, FaUsers, FaArrowLeft } from 'react-icons/fa'

export default function Navbar() {
  const pathname = usePathname()
  
  const navLinks = [
    { href: '/', label: 'Dashboard', icon: <FaHome /> },
    { href: '/books', label: 'Libros', icon: <FaBook /> },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Determinar si mostrar botón "Atrás"
  const showBackButton = pathname !== '/'
  const getBackPath = () => {
    if (pathname.startsWith('/books/') && pathname.includes('/edit')) return '/books'
    if (pathname.startsWith('/books/create')) return '/books'
    if (pathname.startsWith('/authors/') && pathname.includes('/edit')) {
      const authorId = pathname.split('/')[2]
      return `/authors/${authorId}`
    }
    if (pathname.startsWith('/authors/create')) return '/'
    if (pathname.startsWith('/authors/')) return '/'
    if (pathname === '/books') return '/'
    return '/'
  }

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Link 
                href={getBackPath()}
                className="flex items-center px-3 py-2 text-white hover:bg-white/20 rounded-lg transition duration-200"
              >
                <FaArrowLeft className="mr-2" />
                <span className="hidden sm:inline">Atrás</span>
              </Link>
            )}
            <Link href="/" className="flex items-center space-x-3">
              <FaUsers className="text-white text-2xl" />
              <span className="text-white font-bold text-xl hidden sm:block">
                BiblioSystem
              </span>
            </Link>
          </div>

          {/* Links de navegación */}
          <div className="flex space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2 rounded-lg transition duration-200 ${
                  isActive(link.href)
                    ? 'bg-white text-indigo-600 font-semibold'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}