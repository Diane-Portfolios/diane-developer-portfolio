import Image from 'next/image'
import {
  CONSOLE_BOTTOM_INSET,
  SCREEN_CENTRE_X,
  SCREEN_CENTRE_Y,
  SIZE,
} from './console-geometry'
import { AboutNote } from './about-note'
import { GameBoyScreen } from './gameboy-screen'
import { LocationNote } from './location-note'
import { NewSiteNav } from './nav'
import { ROTATION_CSS } from './rotation'

export default function NewSitePage() {
  return (
    <>
      {/* Generated rather than hand-written: the keyframe percentages depend on
          the slot count and fade length, so deriving them in CSS by hand would go
          stale the moment those change. Emitted once for the whole page. */}
      <style dangerouslySetInnerHTML={{ __html: ROTATION_CSS }} />

      {/* Fixed, so it stays put while everything below scrolls under it. Being
          out of flow it no longer pushes the hero down, which is what lets the
          hero be exactly one viewport tall. */}
      <NewSiteNav />

      {/* The hero is exactly one screen, so its bottom edge is the break point:
          everything in here scrolls away as one piece and the next section
          arrives behind it. */}
      <section className="relative h-screen overflow-hidden bg-black">
        {/* The photo runs from the very top of the hero — the opaque navbar
            covers its first ~90px, so it still reads as starting beneath the
            nav without the layout having to know how tall the nav is. */}
        <div
          className="absolute inset-x-0 top-0 z-0"
          style={{ bottom: CONSOLE_BOTTOM_INSET }}
        >
          <Image
            src="/assets/backgrounds/unsplash-controller.jpg"
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            priority
            className="pointer-events-none select-none object-cover"
          />

          {/* Scrim over the whole photo. Sits inside the same box as the image
              so it covers exactly what the image covers, and stays at this
              layer so the console and the side text — both z-10 — sit above it
              untouched. */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
        </div>

        <AboutNote />
        <LocationNote />

        {/* Positioned against the hero, which is exactly one viewport tall, so
            top-1/2 still resolves to the middle of the screen on load. */}
        <div
          className="absolute left-1/2 top-1/2 z-10"
          style={{
            height: SIZE,
            aspectRatio: '812 / 1046',
            transform: `translate(-${SCREEN_CENTRE_X}%, -${SCREEN_CENTRE_Y}%)`,
          }}
        >
          {/* The entrance animation lives here rather than on the image so the
              screen fades and scales in locked to the console. On the image alone
              the video would sit still while the console moved under it. */}
          <div className="ns-enter-gameboy relative h-full w-full">
            <Image
              src="/assets/backgrounds/gameboy.png"
              alt=""
              aria-hidden
              width={812}
              height={1046}
              priority
              className="pointer-events-none h-full w-full select-none"
            />
            <GameBoyScreen />
          </div>
        </div>
      </section>

      {/* Placeholder for whatever comes next. It exists so the page actually
          scrolls past the hero; replace it with real content. */}
      <section id="next" className="min-h-screen bg-black" />
    </>
  )
}
