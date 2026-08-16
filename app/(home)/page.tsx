import Image from 'next/image'
import type { CSSProperties } from 'react'
import { CONSOLE_BOTTOM_INSET, SCREEN_Y_OFFSET, SIZE } from './console-geometry'
import { AboutNote } from './about-note'
import { AboutSection } from './about-section'
import { ContactSection } from './contact-section'
import { ExperienceSection } from './experience-section'
import { GameBoyScreen } from './gameboy-screen'
import { LocationNote } from './location-note'
import { SiteNav } from './nav'
import { ProjectsSection } from './projects-section'
import { ROTATION_CSS } from './rotation'
import { SiteFooter } from './site-footer'

export default function HomePage() {
  return (
    <>
      {/* Generated rather than hand-written: the keyframe percentages depend on
          the slot count and fade length, so deriving them in CSS by hand would go
          stale the moment those change. Emitted once for the whole page. */}
      <style dangerouslySetInnerHTML={{ __html: ROTATION_CSS }} />

      {/* Fixed, so it stays put while everything below scrolls under it. Being
          out of flow it no longer pushes the hero down, which is what lets the
          hero be exactly one viewport tall. */}
      <SiteNav />

      {/* The hero is exactly one screen, so its bottom edge is the break point:
          everything in here scrolls away as one piece and the next section
          arrives behind it. id="home" is the nav's anchor target — no
          scroll-margin-top on it (unlike the sections below), since the hero
          already starts at the literal top of the page and the fixed nav is
          *meant* to overlay its first ~90px rather than be cleared. */}
      <section id="home" className="relative min-h-dvh overflow-hidden bg-black lg:h-dvh">
        {/* The photo runs from the very top of the hero — the opaque navbar
            covers its first ~90px, so it still reads as starting beneath the
            nav without the layout having to know how tall the nav is.
            Below lg the hero's height now grows with its stacked content
            (see the grid below) rather than staying pinned to exactly one
            viewport, so CONSOLE_BOTTOM_INSET — which assumes the console
            sits at the literal viewport centre — only holds at lg and up;
            below that the photo simply runs the full height of its section
            via the plain bottom-0 fallback. */}
        <div
          className="absolute inset-x-0 top-0 z-0 bottom-0 lg:bottom-[var(--hero-photo-bottom)]"
          style={{ '--hero-photo-bottom': CONSOLE_BOTTOM_INSET } as CSSProperties}
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

        {/* 2 columns at lg (1024px) and up: About + the work-location note
            stacked on the left, the console centred on its own on the right —
            place-items-center centres each grid item within its own cell on
            both axes. Below lg it's grid-cols-1, so the same two grid items
            just stack top to bottom instead of sitting side by side — text
            first (see DOM order below), console second — with the section's
            height growing to fit rather than clipping either one. One
            console, rendered once — its position comes from which grid it's
            sitting in, not from two copies of its markup.
            lg:-translate-x-[5%]: with equal 50/50 columns, the console
            (centred in the right half) sits at 75% of the viewport while the
            text (pulled to the gutter) sits just left of centre — so the
            pair's actual midpoint lands well right of centre. Nudging the
            whole grid left re-centres that midpoint without touching either
            column's own alignment or the gap between them. */}
        <div className="relative z-10 grid grid-cols-1 place-items-center gap-y-10 px-6 pb-14 pt-44 lg:h-full lg:grid-cols-2 lg:gap-x-6 lg:gap-y-0 lg:-translate-x-[5%] lg:px-0 lg:pb-0 lg:pt-0 xl:gap-x-10">
          {/* justify-self-start pins this block to the left edge of the
              grid cell instead of the grid's own place-items-center default
              — below lg the name should sit flush against the screen's left
              edge (matching the rest of the site's left/right-aligned
              sections) rather than centred as an island in the middle. At lg
              and up that flips to justify-self-end, pulling the whole column
              to the right edge of its cell — the side nearest the console —
              since it would otherwise drift toward the *outer* edge of the
              viewport instead of the gutter, working against wanting it
              closer to the console rather than farther. items-start (not
              -center) matches: the text inside is left-aligned, so the
              column itself should hug that same left edge rather than
              centring a left-aligned block. */}
          <div className="flex flex-col items-start justify-self-start gap-6 lg:gap-10 lg:justify-self-end">
            <AboutNote />
            <LocationNote />
          </div>

          {/* SCREEN_Y_OFFSET nudges the box down from place-items-center's
              plain geometric centring, so the *screen* — not the image's own
              midpoint — lands at the centre of the cell. */}
          <div
            className="relative"
            style={{
              height: SIZE,
              aspectRatio: '812 / 1046',
              transform: `translateY(${SCREEN_Y_OFFSET}%)`,
            }}
          >
            {/* The entrance animation lives on this inner wrapper rather than
                the sized box above so it can't clobber that box's own
                transform (the Y-offset nudge). On the image alone the video
                would sit still while the console moved under it. */}
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
        </div>
      </section>

      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
      <SiteFooter />
    </>
  )
}
