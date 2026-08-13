'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Played in order, then looped back to the first.
const CLIPS = [
  '/assets/animations/Game Boy Color - Startup Intro.webm',
  '/assets/animations/Pokemon Yellow GBC Intro .webm',
]

// Crossfade between clips. Short enough to read as a cut, long enough to cover
// the first decoded frame of the incoming clip so there's never a black gap.
const CROSSFADE_MS = 220

// The LCD panel's position within gameboy.png, measured off the source: bbox
// x 167..636, y 127..549 of 812x1046. Expressed as percentages so it tracks the
// console at any size.
const SCREEN = {
  left: `${(167 / 812) * 100}%`,
  top: `${(127 / 1046) * 100}%`,
  width: `${(470 / 812) * 100}%`,
  height: `${(423 / 1046) * 100}%`,
}

export function GameBoyScreen() {
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [enabled, setEnabled] = useState(true)

  // Auto-playing a ~49s loop is exactly the kind of motion reduced-motion asks
  // you to stop. When it's set we leave the first frame up and never start.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setEnabled(!mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const current = videos.current[active]
    if (!current) return

    current.currentTime = 0
    // Muted autoplay is permitted, but a rejected play() must not throw.
    void current.play().catch(() => {})

    // Prime the next clip so its first frame is already decoded when its turn
    // comes — without this the crossfade can reveal an undecoded black frame.
    const next = videos.current[(active + 1) % CLIPS.length]
    if (next) next.currentTime = 0
  }, [active, enabled])

  const handleEnded = useCallback(() => {
    setActive((i) => (i + 1) % CLIPS.length)
  }, [])

  return (
    <div
      className="pointer-events-none absolute overflow-hidden rounded-[2px]"
      style={SCREEN}
      // Decorative: the clips carry no information the page doesn't already give.
      aria-hidden="true"
    >
      {CLIPS.map((src, i) => (
        <video
          key={src}
          ref={(el) => {
            videos.current[i] = el
          }}
          // encodeURI because both filenames contain spaces — and the second
          // has one immediately before the extension.
          src={encodeURI(src)}
          muted
          playsInline
          preload="auto"
          onEnded={handleEnded}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            opacity: i === active ? 1 : 0,
            transition: `opacity ${CROSSFADE_MS}ms linear`,
          }}
        />
      ))}
    </div>
  )
}
