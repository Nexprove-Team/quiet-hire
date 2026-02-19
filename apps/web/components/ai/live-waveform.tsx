'use client'

import { cn } from '@hackhyre/ui/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'

type LiveWaveformProps = {
  className?: string
  barCount?: number
  minHeight?: number
  maxHeight?: number
  audioStream?: MediaStream | null
}

export function LiveWaveform({
  className,
  barCount = 5,
  minHeight = 4,
  maxHeight = 24,
  audioStream,
}: LiveWaveformProps) {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => minHeight)
  )
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const barKeys = useMemo(
    () => Array.from({ length: barCount }, (_, i) => `bar-${i}`),
    [barCount]
  )

  useEffect(() => {
    if (!audioStream) {
      setHeights(Array.from({ length: barCount }, () => minHeight))
      return
    }
    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(audioStream)

    analyser.fftSize = 256
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    const dataArray = new Uint8Array(analyser.frequencyBinCount)

    const updateWaveform = () => {
      if (!analyserRef.current) return

      analyserRef.current.getByteFrequencyData(dataArray)
      const newHeights = Array.from({ length: barCount }, (_, i) => {
        const index = Math.floor((i * dataArray.length) / barCount)
        const value = dataArray[index] || 0
        return minHeight + (value / 255) * (maxHeight - minHeight)
      })

      setHeights(newHeights)
      animationFrameRef.current = requestAnimationFrame(updateWaveform)
    }

    updateWaveform()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [audioStream, barCount, minHeight, maxHeight])

  return (
    <div className={cn('flex items-center justify-center gap-0.5', className)}>
      {heights.map((height, i) => (
        <div
          key={barKeys[i]}
          className="w-0.5 rounded-full bg-current transition-all duration-75"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  )
}
