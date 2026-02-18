import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage.jsx'
import InterviewPage from './pages/InterviewPage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import Navbar from './components/Navbar.jsx'

export default function App() {
  return (
    <div className="noise-bg min-h-screen relative">
      {/* Ambient background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div
          className="absolute rounded-full blur-3xl opacity-20"
          style={{
            width: '600px', height: '600px',
            background: 'radial-gradient(circle, #3b72fb 0%, transparent 70%)',
            top: '-200px', right: '-100px',
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-10"
          style={{
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, #5994ff 0%, transparent 70%)',
            bottom: '-150px', left: '-100px',
          }}
        />
        <div
          className="absolute rounded-full blur-3xl opacity-8"
          style={{
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, #8ebbff 0%, transparent 70%)',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </div>
  )
}
