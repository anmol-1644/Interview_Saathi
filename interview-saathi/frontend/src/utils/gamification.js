/**
 * Interview Saathi - Gamification Utility
 * Manages XP, levels, and badges using localStorage
 */

const STORAGE_KEY = 'interview_saathi_progress'

const LEVELS = [
  { name: 'Beginner', minXP: 0, maxXP: 100, emoji: '🌱', color: '#6b7a9e' },
  { name: 'Improving Communicator', minXP: 101, maxXP: 300, emoji: '📈', color: '#3b72fb' },
  { name: 'Interview Ready', minXP: 301, maxXP: Infinity, emoji: '🏆', color: '#f59e0b' },
]

export function getProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { xp: 0, totalInterviews: 0, bestScore: 0 }
    return JSON.parse(raw)
  } catch {
    return { xp: 0, totalInterviews: 0, bestScore: 0 }
  }
}

export function addXP(amount, score) {
  const current = getProgress()
  const updated = {
    xp: (current.xp || 0) + amount,
    totalInterviews: (current.totalInterviews || 0) + 1,
    bestScore: Math.max(current.bestScore || 0, score || 0),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function getLevel(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getXPForNextLevel(xp) {
  const current = getLevel(xp)
  if (current.maxXP === Infinity) return { needed: 0, progress: 100, isMax: true }

  const levelXP = xp - current.minXP
  const levelRange = current.maxXP - current.minXP
  const progress = Math.min(100, Math.round((levelXP / levelRange) * 100))

  return {
    needed: current.maxXP - xp,
    progress,
    isMax: false,
    nextLevel: LEVELS[LEVELS.indexOf(current) + 1]?.name
  }
}

export { LEVELS }
