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
    <div className="relative flex h-screen flex-col overflow-hidden bg-black">
      {/* Generated rather than hand-written: the keyframe percentages depend on
          the slot count and fade length, so deriving them in CSS by hand would go
          stale the moment those change. Emitted once for the whole page. */}
      <style dangerouslySetInnerHTML={{ __html: ROTATION_CSS }} />

      <NewSiteNav />

      {/* Everything below the navbar. The band is pinned to the top of this
          region, so it starts where the nav ends and the nav stays pure black. */}
      <div className="relative flex-1">
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
        </div>
      </div>

      <AboutNote />
      <LocationNote />

      {/* Positioned against the full-height container, not the region above, so
          the centring still resolves against the viewport. */}
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
    </div>
  )
}
