'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { GameBoyMenu } from './gameboy-menu'
import { useGameBoyControls } from './language-context'

const CLIP = '/assets/animations/Game Boy Color - Startup Intro.webm'

// Where to freeze, in seconds. Derived from a per-frame motion profile of the
// clip rather than picked by eye: the logo animates until ~2.53s, sits
// completely still from 2.57s to 3.10s, then starts washing out into the
// fade at ~3.13s. 2.85s is the middle of that still plateau, showing solid
// "GAME BOY" over "Nintendo®" with the most margin on either side.
const FREEZE_AT = 2.85

// How long the frozen logo stays up before the menu replaces it.
const HOLD_MS = 3000

// Length of the cut over to the menu. Short — a real console would switch
// instantly, and anything slower reads as a dissolve rather than a boot.
const SWITCH_MS = 180

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
  const video = useRef<HTMLVideoElement | null>(null)
  const frame = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [reduced, setReduced] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const { setControlsEnabled } = useGameBoyControls()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReduced(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const holdThenSwitch = useCallback(() => {
    // The D-pad/B overlay (see ./gameboy-controls) only goes live once the
    // menu itself is on screen — pressing it during the boot video/logo
    // hold would silently change the site's language with nothing on the
    // console showing why.
    timer.current = setTimeout(() => {
      setShowMenu(true)
      setControlsEnabled(true)
    }, HOLD_MS)
  }, [setControlsEnabled])

  // Watch on every animation frame rather than via timeupdate, which only fires
  // about four times a second and would overshoot the freeze point by a wide
  // and variable margin.
  const watch = useCallback(() => {
    const el = video.current
    if (!el) return
    if (el.currentTime >= FREEZE_AT) {
      el.pause()
      // Snap back to the exact mark: rAF can only catch it a frame late.
      el.currentTime = FREEZE_AT
      frame.current = null
      holdThenSwitch()
      return
    }
    frame.current = requestAnimationFrame(watch)
  }, [holdThenSwitch])

  useEffect(() => {
    const el = video.current
    if (!el) return

    if (reduced) {
      // Show the settled logo without ever animating to it, then still give the
      // hold before the menu — the swap is a content change, not motion.
      el.pause()
      el.currentTime = FREEZE_AT
      holdThenSwitch()
    } else {
      el.currentTime = 0
      // Muted autoplay is permitted, but a rejected play() must not throw.
      void el.play().catch(() => {})
      frame.current = requestAnimationFrame(watch)
    }

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current)
      if (timer.current !== null) clearTimeout(timer.current)
      frame.current = null
      timer.current = null
    }
  }, [reduced, watch, holdThenSwitch])

  return (
    <div
      className="pointer-events-none absolute overflow-hidden rounded-[2px]"
      // container-type lets the menu size itself in cqh/cqw against this box.
      style={{ ...SCREEN, containerType: 'size' }}
      // Decorative: the clip carries no information the page doesn't already give.
      aria-hidden="true"
    >
      <video
        ref={video}
        // encodeURI because the filename contains spaces.
        src={encodeURI(CLIP)}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{
          opacity: showMenu ? 0 : 1,
          transition: reduced ? undefined : `opacity ${SWITCH_MS}ms linear`,
        }}
      />

      <div
        style={{
          opacity: showMenu ? 1 : 0,
          transition: reduced ? undefined : `opacity ${SWITCH_MS}ms linear`,
        }}
      >
        <GameBoyMenu />
      </div>
    </div>
  )
}
