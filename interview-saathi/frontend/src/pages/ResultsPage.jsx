import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  CheckCircle, XCircle, Star, MessageSquare, Lightbulb,
  RefreshCw, Trophy, Zap, ChevronRight, Quote
} from 'lucide-react'
import ScoreRing from '../components/ScoreRing.jsx'
import { addXP, getProgress, getLevel, getXPForNextLevel } from '../utils/gamification.js'

/* ── Small score metric card ── */
function ScoreCard({ label, score, maxScore = 10, color }) {
  const pct = (score / maxScore) * 100
  return (
    <div className="glass-card-light p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-ink-300 text-sm font-medium">{label}</span>
        <span className="font-display font-bold text-white">{score}<span className="text-ink-500 text-xs font-normal">/{maxScore}</span></span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 8px ${color}60`,
            transitionDelay: '300ms',
          }} />
      </div>
    </div>
  )
}

/* ── XP progress bar ── */
function XPBar({ xp }) {
  const level = getLevel(xp)
  const { progress, needed, isMax, nextLevel } = getXPForNextLevel(xp)

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{level.emoji}</span>
          <div>
            <div className="font-display font-bold text-white text-sm">{level.name}</div>
            <div className="text-ink-400 text-xs">{xp} XP total</div>
          </div>
        </div>
        {!isMax && (
          <div className="text-right">
            <div className="text-xs text-ink-400">{needed} XP to next level</div>
            <div className="text-xs text-saathi-400">{nextLevel}</div>
          </div>
        )}
      </div>

      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full xp-bar-shimmer transition-all duration-1000 ease-out"
          style={{
            width: `${isMax ? 100 : progress}%`,
            transitionDelay: '500ms',
          }} />
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { analysis, role, question } = location.state || {}

  const [progress, setProgress] = useState(null)
  const [showBadge, setShowBadge] = useState(false)

  // Redirect if no data
  useEffect(() => {
    if (!analysis) {
      navigate('/')
      return
    }

    // Save XP and update progress
    const updated = addXP(analysis.xp_earned || 50, analysis.readiness_score)
    setProgress(updated)

    // Show badge animation if score > 75
    if (analysis.readiness_score >= 75) {
      setTimeout(() => setShowBadge(true), 1500)
    }
  }, [analysis])

  if (!analysis) return null

  const {
    transcript,
    grammar_score,
    structure_score,
    professional_tone_score,
    confidence_score,
    filler_words,
    star_method_detected,
    improvement_suggestions,
    rewritten_professional_answer,
    readiness_score,
    xp_earned,
  } = analysis

  const scoreColor = readiness_score >= 75 ? '#22c55e'
                   : readiness_score >= 50 ? '#3b72fb'
                   : readiness_score >= 30 ? '#f59e0b'
                   : '#ef4444'

  const scoreLabel = readiness_score >= 75 ? 'Excellent!'
                   : readiness_score >= 50 ? 'Good Progress'
                   : readiness_score >= 30 ? 'Keep Practicing'
                   : 'Needs Work'

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ═══ HEADER ═══ */}
        <div className="text-center mb-10">
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            Interview Analysis Report
          </h1>
          <p className="text-ink-300">
            <span className="text-saathi-400 font-medium">{role}</span>
            {' · '}
            <span className="text-ink-400 text-sm italic truncate max-w-xs inline-block align-bottom">
              {question}
            </span>
          </p>
        </div>

        {/* ═══ SCORE HERO ═══ */}
        <div className="glass-card p-8 mb-6 flex flex-col sm:flex-row items-center gap-8">
          {/* Ring */}
          <div className="shrink-0">
            <ScoreRing score={readiness_score} size={160} strokeWidth={12} />
          </div>

          {/* Label + XP */}
          <div className="flex-1 text-center sm:text-left">
            <div className="text-ink-400 text-sm mb-1 uppercase tracking-widest font-medium">
              Interview Readiness Score
            </div>
            <div className="font-display font-bold text-4xl mb-2" style={{ color: scoreColor }}>
              {scoreLabel}
            </div>
            <p className="text-ink-300 text-sm mb-4">
              Weighted across grammar, structure, tone & confidence
            </p>

            {/* XP Earned badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-saathi-950/80 border border-saathi-700/40">
              <Zap size={14} className="text-saathi-400" />
              <span className="font-display font-bold text-saathi-300">+{xp_earned} XP Earned</span>
            </div>

            {/* Achievement badge */}
            {showBadge && (
              <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full
                              bg-yellow-950/60 border border-yellow-600/40 animate-fade-up ml-2">
                <Trophy size={14} className="text-yellow-400" />
                <span className="font-bold text-yellow-300 text-sm">Interview Ready Badge!</span>
              </div>
            )}
          </div>
        </div>

        {/* ═══ XP PROGRESS ═══ */}
        {progress && (
          <div className="mb-6">
            <XPBar xp={progress.xp} />
          </div>
        )}

        {/* ═══ SCORE BREAKDOWN ═══ */}
        <div className="mb-6">
          <h2 className="font-display font-semibold text-lg text-white mb-3">Score Breakdown</h2>
          <div className="grid grid-cols-2 gap-3">
            <ScoreCard label="Grammar" score={grammar_score} color="#3b72fb" />
            <ScoreCard label="Structure" score={structure_score} color="#8b5cf6" />
            <ScoreCard label="Professional Tone" score={professional_tone_score} color="#10b981" />
            <ScoreCard label="Confidence" score={Math.round(confidence_score)} color="#f59e0b" />
          </div>
        </div>

        {/* ═══ STAR METHOD ═══ */}
        <div className="glass-card-light p-4 mb-6 flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
                           ${star_method_detected ? 'bg-green-950/50 border border-green-700/40' : 'bg-red-950/40 border border-red-800/30'}`}>
            {star_method_detected
              ? <CheckCircle size={18} className="text-green-400" />
              : <XCircle size={18} className="text-red-400" />
            }
          </div>
          <div>
            <div className="font-semibold text-white text-sm">STAR Method</div>
            <div className="text-ink-400 text-xs">
              {star_method_detected
                ? '✅ Great! Your answer used the Situation–Task–Action–Result structure.'
                : '❌ Try structuring with: Situation → Task → Action → Result for stronger impact.'
              }
            </div>
          </div>
        </div>

        {/* ═══ FILLER WORDS ═══ */}
        {filler_words && filler_words.length > 0 && (
          <div className="glass-card-light p-5 mb-6">
            <h2 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-amber-400" />
              Filler Words Detected
            </h2>
            <div className="flex flex-wrap gap-2">
              {filler_words.map((word, i) => (
                <span key={i}
                      className="px-3 py-1 rounded-full text-sm font-mono
                                 bg-amber-950/40 border border-amber-700/40 text-amber-300">
                  "{word}"
                </span>
              ))}
            </div>
            <p className="text-ink-400 text-xs mt-3">
              Reducing filler words makes you sound more confident and prepared.
            </p>
          </div>
        )}

        {/* ═══ YOUR TRANSCRIPT ═══ */}
        <div className="glass-card-light p-5 mb-6">
          <h2 className="font-display font-semibold text-white mb-3 flex items-center gap-2">
            <Quote size={16} className="text-ink-400" />
            What You Said
          </h2>
          <p className="text-ink-300 text-sm leading-relaxed italic">
            "{transcript}"
          </p>
        </div>

        {/* ═══ PROFESSIONAL REWRITE ═══ */}
        <div className="glass-card mb-6 overflow-hidden"
             style={{
               borderColor: 'rgba(16,185,129,0.2)',
               background: 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, rgba(13,18,32,0.8) 100%)',
             }}>
          <div className="px-5 py-3 border-b border-green-900/30 flex items-center gap-2">
            <Star size={15} className="text-green-400" />
            <span className="font-display font-semibold text-green-300 text-sm">
              Professional Rewritten Answer
            </span>
          </div>
          <div className="p-5">
            <p className="text-white leading-relaxed">{rewritten_professional_answer}</p>
          </div>
        </div>

        {/* ═══ IMPROVEMENT SUGGESTIONS ═══ */}
        {improvement_suggestions && improvement_suggestions.length > 0 && (
          <div className="glass-card-light p-5 mb-8">
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb size={16} className="text-saathi-400" />
              Improvement Suggestions
            </h2>
            <div className="space-y-3">
              {improvement_suggestions.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-saathi-900/60 border border-saathi-700/40
                                  flex items-center justify-center text-xs font-bold text-saathi-400 shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-ink-200 text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ACTION BUTTONS ═══ */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/interview', { state: { role } })}
            className="btn-primary flex-1 py-4 text-base flex items-center justify-center gap-2">
            <RefreshCw size={16} />
            Practice Again
          </button>
          <button
            onClick={() => navigate('/interview')}
            className="flex-1 py-4 text-base rounded-xl border border-white/10 text-ink-300
                       hover:border-white/20 hover:text-white transition-all duration-200
                       flex items-center justify-center gap-2">
            Try Different Role
            <ChevronRight size={16} />
          </button>
        </div>

        <p className="text-center text-ink-600 text-xs mt-6">
          Keep practicing daily. Your dream company is closer than you think. 🚀
        </p>

      </div>
    </div>
  )
}
