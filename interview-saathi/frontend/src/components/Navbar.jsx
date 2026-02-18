import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Mic } from 'lucide-react'

export default function Navbar() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
         style={{
           background: 'rgba(8, 11, 20, 0.7)',
           backdropFilter: 'blur(20px)',
           borderBottom: '1px solid rgba(255,255,255,0.05)'
         }}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saathi-500 to-saathi-700 flex items-center justify-center
                        shadow-lg shadow-saathi-600/30 group-hover:scale-105 transition-transform duration-200">
          <Mic size={15} className="text-white" />
        </div>
        <span className="font-display font-bold text-white text-lg tracking-tight">
          Interview <span className="gradient-text">Saathi</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-6">
        {!isHome && (
          <Link to="/"
                className="text-sm font-medium text-ink-300 hover:text-white transition-colors duration-200">
            ← Home
          </Link>
        )}
        {isHome && (
          <Link to="/interview"
                className="btn-primary px-5 py-2 text-sm">
            Start Practice
          </Link>
        )}
      </div>
    </nav>
  )
}
