import React, { useEffect, useState } from 'react'
import { Brain } from 'lucide-react'

const PROCESSING_STEPS = [
  '🎤 Transcribing your audio with Whisper...',
  '🧠 Analyzing grammar and structure...',
  '💬 Evaluating professional tone...',
  '✍️ Rewriting your answer professionally...',
  '📊 Calculating Interview Readiness Score...',
  '🎯 Preparing your feedback report...',
]

/**
 * LoadingOverlay - Full-page loading animation during AI processing
 */
export default function LoadingOverlay({ visible }) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!visible) {
      setStepIndex(0)
      return
    }

    // Cycle through steps every 2.5 seconds
    const interval = setInterval(() => {
      setStepIndex(i => (i + 1) % PROCESSING_STEPS.length)
    }, 2500)

    return () => clearInterval(interval)
  }, [visible])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
         style={{ background: 'rgba(8, 11, 20, 0.92)', backdropFilter: 'blur(12px)' }}>

      <div className="flex flex-col items-center gap-8 max-w-sm text-center px-4">

        {/* Spinning brain orb */}
        <div className="relative w-24 h-24">
          {/* Outer rings */}
          <div className="absolute inset-0 rounded-full border-2 border-saathi-600/30 animate-ping" />
          <div className="absolute inset-2 rounded-full border border-saathi-500/40 animate-pulse-slow" />

          {/* Center orb */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-saathi-600 to-saathi-800
                          flex items-center justify-center glow-blue">
            <Brain size={24} className="text-white animate-pulse" />
          </div>

          {/* Rotating dashes */}
          <svg className="absolute inset-0 w-full h-full animate-spin"
               style={{ animationDuration: '3s' }}
               viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="44"
                    fill="none"
                    stroke="rgba(59,114,251,0.4)"
                    strokeWidth="2"
                    strokeDasharray="8 12"
                    strokeLinecap="round" />
          </svg>
        </div>

        {/* Title */}
        <div>
          <h3 className="font-display font-bold text-xl text-white mb-2">
            AI is analyzing your answer
          </h3>
          <p className="text-ink-400 text-sm">
            Whisper + Groq LLM working in parallel
          </p>
        </div>

        {/* Animated step */}
        <div className="glass-card px-6 py-4 w-full min-h-[60px] flex items-center justify-center">
          <p key={stepIndex}
             className="text-saathi-300 text-sm font-medium text-center animate-fade-up">
            {PROCESSING_STEPS[stepIndex]}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {PROCESSING_STEPS.map((_, i) => (
            <div key={i}
                 className="w-1.5 h-1.5 rounded-full transition-all duration-500"
                 style={{
                   background: i <= stepIndex ? '#3b72fb' : 'rgba(255,255,255,0.1)',
                   transform: i === stepIndex ? 'scale(1.4)' : 'scale(1)',
                 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
