import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Briefcase, Users, GraduationCap, RefreshCw, Send, AlertCircle } from 'lucide-react'
import RecordingButton from '../components/RecordingButton.jsx'
import LoadingOverlay from '../components/LoadingOverlay.jsx'
import { useAudioRecorder } from '../utils/useAudioRecorder.js'

const ROLES = [
  {
    id: 'Software Engineer',
    label: 'Software Engineer',
    icon: Briefcase,
    desc: 'Technical + behavioral',
    color: '#3b72fb',
    bg: 'rgba(59,114,251,0.08)',
    border: 'rgba(59,114,251,0.25)',
  },
  {
    id: 'HR Interview',
    label: 'HR Interview',
    icon: Users,
    desc: 'Soft skills & personality',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
    border: 'rgba(139,92,246,0.25)',
  },
  {
    id: 'MBA Interview',
    label: 'MBA Interview',
    icon: GraduationCap,
    desc: 'Leadership & strategy',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
  },
]
const API_BASE_URL = "https://interview-saathi-backend.onrender.com";
export default function InterviewPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // State
  const [selectedRole, setSelectedRole] = useState(location.state?.role || null)
  const [question, setQuestion] = useState(null)
  const [questionLoading, setQuestionLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState(null)

  // Audio recorder hook
  const {
    isRecording, audioBlob, error: recError,
    duration, startRecording, stopRecording, resetRecording
  } = useAudioRecorder()

  // Fetch question when role is selected
  useEffect(() => {
    if (selectedRole) fetchQuestion(selectedRole)
  }, [selectedRole])

  async function fetchQuestion(role) {
    setQuestionLoading(true)
    setError(null)
    setQuestion(null)
    resetRecording()

    try {
      const res = await axios.post(`${API_BASE_URL}/api/question`, { role })
      setQuestion(res.data.question)
    } catch (err) {
      setError('Failed to fetch question. Is the backend running?')
    } finally {
      setQuestionLoading(false)
    }
  }

  async function handleSubmit() {
    if (!audioBlob) return
    setSubmitLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('role', selectedRole)
      formData.append('question', question)

      const res = await axios.post(`${API_BASE_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000, // 2 min timeout for Whisper + LLM
      })

      // Navigate to results with the analysis data
      navigate('/results', {
        state: {
          analysis: res.data,
          role: selectedRole,
          question,
        }
      })
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Analysis failed'
      setError(msg)
    } finally {
      setSubmitLoading(false)
    }
  }

  const selectedRoleData = ROLES.find(r => r.id === selectedRole)

  return (
    <>
      <LoadingOverlay visible={submitLoading} />

      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Page header */}
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-3xl text-white mb-2">Mock Interview</h1>
            <p className="text-ink-300">Select a role, get a question, record your answer</p>
          </div>

          {/* ── STEP 1: Role Selection ── */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-saathi-600 flex items-center justify-center text-xs font-bold text-white">1</div>
              <span className="font-semibold text-white">Choose Interview Type</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id

                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-2xl text-left transition-all duration-200
                                border ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                    style={{
                      background: isSelected ? role.bg : 'rgba(13,18,32,0.6)',
                      borderColor: isSelected ? role.border : 'rgba(255,255,255,0.07)',
                      boxShadow: isSelected ? `0 4px 20px ${role.color}20` : 'none',
                    }}>

                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                         style={{ background: `${role.color}15`, border: `1px solid ${role.color}30` }}>
                      <Icon size={17} style={{ color: role.color }} />
                    </div>

                    <div className="font-display font-semibold text-white text-sm leading-tight mb-1">
                      {role.label}
                    </div>
                    <div className="text-ink-400 text-xs">{role.desc}</div>

                    {isSelected && (
                      <div className="mt-2 w-full h-0.5 rounded-full"
                           style={{ background: role.color, opacity: 0.6 }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── STEP 2: Question ── */}
          {selectedRole && (
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-saathi-600 flex items-center justify-center text-xs font-bold text-white">2</div>
                <span className="font-semibold text-white">Interview Question</span>
              </div>

              <div className="glass-card p-6 relative overflow-hidden">
                {/* Role accent line */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                     style={{ background: selectedRoleData?.color }} />

                {questionLoading ? (
                  <div className="flex items-center gap-3 pl-4">
                    <div className="w-4 h-4 rounded-full border-2 border-saathi-500 border-t-transparent animate-spin" />
                    <span className="text-ink-400 text-sm">Generating question...</span>
                  </div>
                ) : question ? (
                  <div className="pl-4">
                    <p className="text-white text-lg leading-relaxed font-medium">{question}</p>
                    <button
                      onClick={() => fetchQuestion(selectedRole)}
                      className="mt-4 flex items-center gap-1.5 text-ink-400 hover:text-ink-200 text-sm transition-colors">
                      <RefreshCw size={12} />
                      Get different question
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* ── STEP 3: Record ── */}
          {question && !questionLoading && (
            <div className="mb-8 animate-fade-up">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-saathi-600 flex items-center justify-center text-xs font-bold text-white">3</div>
                <span className="font-semibold text-white">Record Your Answer</span>
                <span className="text-ink-400 text-xs">(Hinglish is fine!)</span>
              </div>

              <div className="glass-card p-8 flex flex-col items-center gap-6">
                {/* Tips */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {['Speak clearly', 'Aim for 1-2 min', 'Use STAR method'].map(tip => (
                    <span key={tip}
                          className="px-3 py-1 rounded-full text-xs font-medium text-saathi-300
                                     bg-saathi-950/60 border border-saathi-700/30">
                      {tip}
                    </span>
                  ))}
                </div>

                <RecordingButton
                  isRecording={isRecording}
                  hasRecording={!!audioBlob}
                  duration={duration}
                  onStart={startRecording}
                  onStop={stopRecording}
                  onReset={resetRecording}
                />

                {/* Mic error */}
                {recError && (
                  <div className="flex items-start gap-2 text-red-400 text-sm bg-red-950/30
                                  border border-red-800/30 rounded-xl px-4 py-3 w-full">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{recError}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 4: Submit ── */}
          {audioBlob && !isRecording && (
            <div className="animate-fade-up">
              {error && (
                <div className="flex items-start gap-2 text-red-400 text-sm bg-red-950/30
                                border border-red-800/30 rounded-xl px-4 py-3 mb-4">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2.5">
                <Send size={18} />
                Analyze My Answer with AI
              </button>

              <p className="text-center text-ink-500 text-xs mt-3">
                Powered by Whisper speech-to-text + Groq LLaMA 3
              </p>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
