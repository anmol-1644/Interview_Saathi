import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Mic, Brain, Star, TrendingUp, Award, MessageSquare, Zap, ChevronRight, CheckCircle
} from 'lucide-react'

/* ── Feature card data ── */
const FEATURES = [
  {
    icon: Mic,
    title: 'Speak & Get Analyzed',
    desc: 'Record your answer. Whisper AI transcribes it. Groq LLM gives you deep feedback in seconds.',
    color: '#3b72fb',
  },
  {
    icon: Brain,
    title: 'AI-Powered Feedback',
    desc: 'Grammar, tone, structure, filler words — every aspect scored with actionable suggestions.',
    color: '#8b5cf6',
  },
  {
    icon: Star,
    title: 'STAR Method Coach',
    desc: 'AI detects if your answer follows the gold-standard Situation–Task–Action–Result format.',
    color: '#f59e0b',
  },
  {
    icon: MessageSquare,
    title: 'Professional Rewriter',
    desc: 'See your raw Hinglish answer transformed into polished, interview-ready English.',
    color: '#10b981',
  },
  {
    icon: TrendingUp,
    title: 'Interview Readiness Score',
    desc: 'Get a holistic 0-100 score across grammar, structure, tone, and confidence.',
    color: '#f43f5e',
  },
  {
    icon: Award,
    title: 'Gamified Progress',
    desc: 'Earn XP, level up from Beginner to Interview Ready, and unlock badges.',
    color: '#f97316',
  },
]

const ROLES = ['Software Engineer', 'HR Interview', 'MBA Interview']

/* ── Animated counter ── */
function AnimatedStat({ value, label }) {
  return (
    <div className="text-center">
      <div className="font-display font-bold text-4xl gradient-text">{value}</div>
      <div className="text-ink-300 text-sm mt-1 font-medium">{label}</div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  // Parallax scroll effect on hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen pt-16">

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">

        {/* Floating orbs */}
        <div ref={heroRef} className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute w-2 h-2 rounded-full bg-saathi-400 opacity-60 animate-float"
               style={{ top: '20%', left: '15%', animationDelay: '0s' }} />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-saathi-300 opacity-40 animate-float"
               style={{ top: '60%', left: '85%', animationDelay: '1s' }} />
          <div className="absolute w-3 h-3 rounded-full bg-saathi-500 opacity-30 animate-float"
               style={{ top: '75%', left: '20%', animationDelay: '2s' }} />
          <div className="absolute w-1 h-1 rounded-full bg-saathi-200 opacity-50 animate-float"
               style={{ top: '35%', left: '75%', animationDelay: '0.5s' }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center animate-stagger">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
                          border border-saathi-600/40 bg-saathi-950/50 text-saathi-300 text-sm font-medium">
            <Zap size={13} className="text-saathi-400" />
            AI-Powered Mock Interviews for Everyone
          </div>

          {/* Headline */}
          <h1 className="hero-title font-display font-bold leading-[1.05] mb-6 tracking-tight"
              style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
            <span className="text-white">Interview </span>
            <span className="gradient-text glow-text">Saathi</span>
            <br />
            <span className="text-ink-300" style={{ fontSize: '0.6em', fontWeight: 500 }}>
              Practice Interviews with AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-ink-200 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Designed for Hindi, Awadhi, and Bhojpuri speaking students — improve your
            professional English communication and crack your dream interview with confidence.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/interview')}
              className="btn-primary px-8 py-4 text-base flex items-center gap-2.5 group">
              <Mic size={18} />
              Start Interview
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-ink-300 text-sm">
              <CheckCircle size={14} className="text-green-400" />
              Free to use · No signup needed
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-12 mt-16 pt-12
                          border-t border-white/5">
            <AnimatedStat value="3+" label="Interview Types" />
            <div className="w-px h-10 bg-white/10" />
            <AnimatedStat value="AI" label="Instant Feedback" />
            <div className="w-px h-10 bg-white/10" />
            <AnimatedStat value="100%" label="Free & Local" />
          </div>
        </div>
      </section>

      {/* ═══ ROLE SELECTOR PREVIEW ═══ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display font-bold text-2xl text-center text-white mb-3">
            Choose Your Interview Track
          </h2>
          <p className="text-center text-ink-300 mb-10">
            Each role gets specialized AI questions and tailored feedback
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ROLES.map((role, i) => {
              const colors = [
                { border: '#3b72fb', glow: 'rgba(59,114,251,0.15)', icon: '💻' },
                { border: '#8b5cf6', glow: 'rgba(139,92,246,0.15)', icon: '🤝' },
                { border: '#f59e0b', glow: 'rgba(245,158,11,0.15)', icon: '🎓' },
              ][i]

              return (
                <button
                  key={role}
                  onClick={() => navigate('/interview', { state: { role } })}
                  className="glass-card p-6 text-left group cursor-pointer transition-all duration-300
                             hover:translate-y-[-4px] hover:border-opacity-50"
                  style={{
                    borderColor: `${colors.border}30`,
                    boxShadow: `0 4px 20px ${colors.glow}`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${colors.border}60`
                    e.currentTarget.style.boxShadow = `0 8px 40px ${colors.glow}`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = `${colors.border}30`
                    e.currentTarget.style.boxShadow = `0 4px 20px ${colors.glow}`
                  }}>
                  <span className="text-3xl mb-3 block">{colors.icon}</span>
                  <h3 className="font-display font-semibold text-white text-lg mb-1">{role}</h3>
                  <p className="text-ink-300 text-sm">
                    {i === 0 && 'Technical + behavioral questions for dev roles'}
                    {i === 1 && 'Soft skills, personality & situational questions'}
                    {i === 2 && 'Leadership, strategy & case interview prep'}
                  </p>
                  <div className="flex items-center gap-1 mt-4 text-sm font-medium"
                       style={{ color: colors.border }}>
                    Practice now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display font-bold text-3xl text-white mb-3">
              Everything You Need to Ace Your Interview
            </h2>
            <p className="text-ink-300 text-lg max-w-2xl mx-auto">
              Powered by Whisper + Groq. Built for Indian students who dream big.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title}
                     className="glass-card p-6 group hover:translate-y-[-2px] transition-all duration-300">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                       style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}>
                    <Icon size={20} style={{ color: feature.color }} />
                  </div>
                  <h3 className="font-display font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-ink-300 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-bold text-3xl text-center text-white mb-14">
            How It Works
          </h2>
          <div className="space-y-4">
            {[
              { step: '01', title: 'Choose your interview type', desc: 'Software Engineer, HR, or MBA — pick what you need.' },
              { step: '02', title: 'Get an AI-generated question', desc: 'Fresh, role-specific questions every time.' },
              { step: '03', title: 'Record your answer', desc: 'Speak naturally — Hinglish is perfectly fine!' },
              { step: '04', title: 'Get instant AI feedback', desc: 'Scores, suggestions, rewritten answer, and XP earned.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-5 glass-card-light p-5">
                <div className="font-mono text-saathi-500 font-bold text-sm mt-0.5 shrink-0 w-8">{step}</div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-ink-300 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12"
               style={{
                 background: 'linear-gradient(135deg, rgba(59,114,251,0.08) 0%, rgba(8,11,20,0.8) 100%)',
                 borderColor: 'rgba(59,114,251,0.2)',
               }}>
            <h2 className="font-display font-bold text-3xl text-white mb-4">
              Apna Interview Journey Shuru Karo
            </h2>
            <p className="text-ink-300 mb-8 text-lg">
              Your dream company is waiting. Start practicing today — for free.
            </p>
            <button
              onClick={() => navigate('/interview')}
              className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
              <Mic size={18} />
              Start Mock Interview
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center text-ink-400 text-sm">
        Built with ❤️ for Indian students · Powered by Whisper + Groq
      </footer>
    </div>
  )
}
