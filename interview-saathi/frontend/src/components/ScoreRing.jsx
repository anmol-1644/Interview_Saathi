import React, { useEffect, useState } from 'react'

/**
 * ScoreRing - Animated SVG circular progress indicator
 * Shows a glowing ring that fills to the given score percentage
 */
export default function ScoreRing({ score, size = 160, strokeWidth = 10 }) {
  const [animatedScore, setAnimatedScore] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = animatedScore / 100
  const strokeDashoffset = circumference - progress * circumference

  // Score color gradient
  const getColor = (s) => {
    if (s >= 75) return '#22c55e'   // green
    if (s >= 50) return '#3b72fb'   // blue
    if (s >= 30) return '#f59e0b'   // amber
    return '#ef4444'                // red
  }

  const color = getColor(score)

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        style={{ transform: 'rotate(-90deg)' }}>

        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="score-ring"
          style={{
            filter: `drop-shadow(0 0 8px ${color}80)`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-3xl" style={{ color }}>
          {Math.round(animatedScore)}
        </span>
        <span className="text-ink-400 text-xs font-medium mt-0.5">/ 100</span>
      </div>
    </div>
  )
}
