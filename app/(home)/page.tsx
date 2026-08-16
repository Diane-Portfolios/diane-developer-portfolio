import Image from 'next/image'
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
      <section id="home" className="relative h-screen overflow-hidden bg-black">
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

        {/* 2 columns at lg (1024px) and up: About + the work-location note
            stacked on the left, the console centred on its own on the right —
            place-items-center centres each grid item within its own cell on
            both axes. Below lg it's grid-cols-1: the left column (hidden
            below lg) drops out of layout entirely, leaving the console as
            the grid's only item, centred on the full width exactly as
            before. One console, rendered once — its position comes from
            which grid it's sitting in, not from two copies of its markup.
            lg:-translate-x-[5%]: with equal 50/50 columns, the console
            (centred in the right half) sits at 75% of the viewport while the
            text (pulled to the gutter) sits just left of centre — so the
            pair's actual midpoint lands well right of centre. Nudging the
            whole grid left re-centres that midpoint without touching either
            column's own alignment or the gap between them. */}
        <div className="relative z-10 grid h-full grid-cols-1 place-items-center lg:grid-cols-2 lg:gap-x-6 lg:-translate-x-[5%] xl:gap-x-10">
          {/* items-start (not -center): the text inside is left-aligned now,
              so the column itself should hug that same left edge rather than
              centring a left-aligned block. lg:justify-self-end pulls the
              whole column to the right edge of its grid cell — the side
              nearest the console — since a left-aligned block would
              otherwise drift toward the *outer* edge of the viewport instead
              of the gutter, working against wanting it closer to the console
              rather than farther. */}
          <div className="hidden flex-col items-start gap-10 lg:flex lg:justify-self-end">
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
