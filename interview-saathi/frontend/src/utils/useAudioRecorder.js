/**
 * Interview Saathi - useAudioRecorder Hook
 * Handles microphone access, MediaRecorder, and audio blob creation
 */

import { useState, useRef, useCallback } from 'react'

const MIME_TYPES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/ogg;codecs=opus',
  'audio/ogg',
  'audio/mp4',
]

function getSupportedMimeType() {
  for (const type of MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) return type
  }
  return ''
}

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const [error, setError] = useState(null)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)
  const streamRef = useRef(null)

  const startRecording = useCallback(async () => {
    setError(null)
    setAudioBlob(null)
    setDuration(0)
    chunksRef.current = []

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,  // 16kHz is ideal for Whisper
          echoCancellation: true,
          noiseSuppression: true,
        }
      })

      streamRef.current = stream

      const mimeType = getSupportedMimeType()
      const options = mimeType ? { mimeType } : {}
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || 'audio/webm'
        })
        setAudioBlob(blob)
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.onerror = (e) => {
        setError(`Recording error: ${e.error}`)
        setIsRecording(false)
      }

      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)

      // Duration timer
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)

    } catch (err) {
      if (err.name === 'NotAllowedError') {
        setError('Microphone access denied. Please allow microphone access and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No microphone found. Please connect a microphone.')
      } else {
        setError(`Failed to start recording: ${err.message}`)
      }
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      clearInterval(timerRef.current)
    }
  }, [isRecording])

  const resetRecording = useCallback(() => {
    setAudioBlob(null)
    setError(null)
    setDuration(0)
    chunksRef.current = []
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }, [])

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return {
    isRecording,
    audioBlob,
    error,
    duration,
    formattedDuration: formatDuration(duration),
    startRecording,
    stopRecording,
    resetRecording,
  }
}
