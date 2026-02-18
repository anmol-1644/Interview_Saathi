import React from 'react'
import { Mic, Square, RotateCcw } from 'lucide-react'

/**
 * RecordingButton - Animated recording control
 * Shows mic button, stop button, and reset button states
 */
export default function RecordingButton({ isRecording, hasRecording, duration, onStart, onStop, onReset }) {
  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Main recording button */}
      <div className="relative">
        {/* Outer pulse ring (only when recording) */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-red-500 opacity-40 recording-pulse
                            scale-125 pointer-events-none" />
            <div className="absolute inset-0 rounded-full border-2 border-red-400 opacity-20
                            scale-150 animate-ping pointer-events-none" />
          </>
        )}

        <button
          onClick={isRecording ? onStop : onStart}
          className={`w-20 h-20 rounded-full flex items-center justify-center
                      font-bold text-white transition-all duration-300 relative z-10
                      ${isRecording
                        ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/40'
                        : hasRecording
                          ? 'bg-ink-700 hover:bg-ink-600 cursor-not-allowed'
                          : 'btn-primary glow-blue'
                      }`}
          disabled={hasRecording && !isRecording}>

          {isRecording
            ? <Square size={28} fill="white" />
            : <Mic size={28} />
          }
        </button>
      </div>

      {/* Status label */}
      <div className="text-center">
        {isRecording ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-mono font-medium text-sm">
              Recording · {formatDuration(duration)}
            </span>
          </div>
        ) : hasRecording ? (
          <span className="text-green-400 font-medium text-sm flex items-center gap-1">
            ✓ Recording saved ({formatDuration(duration)}s)
          </span>
        ) : (
          <span className="text-ink-400 text-sm">Click to start recording</span>
        )}
      </div>

      {/* Reset button */}
      {hasRecording && !isRecording && (
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-ink-400 hover:text-ink-200
                     text-sm transition-colors duration-200">
          <RotateCcw size={13} />
          Record Again
        </button>
      )}
    </div>
  )
}
