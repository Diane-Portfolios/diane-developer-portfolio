import Image from 'next/image'
import { GameBoyScreen } from './gameboy-screen'
import { NewSiteNav } from './nav'

// Measured off the source PNG (812x1046) by scanning for the dark LCD panel:
// bbox x 167..636, y 127..549. Its centre lands at 49.45% / 32.31% of the image
// — noticeably above the image's own midpoint, since the console's body extends
// much further below the screen than above it.
const SCREEN_CENTRE_X = 49.45
const SCREEN_CENTRE_Y = 32.31

// Sizing: the console is 812/1046 ≈ 0.776 wide-to-tall. With the screen centre
// pinned to the viewport centre, the taller half is the 67.69% below it, so the
// whole console stays on screen while that half fits in 50vh — i.e. up to ~73vh.
// The 122vw term is the same limit expressed for narrow viewports, so the
// console shrinks rather than overflowing on a phone.
const SIZE = 'min(73vh, 122vw)'

// Distance from the bottom of the viewport up to where the console ends.
//
// The console's centre sits at 50vh and SCREEN_CENTRE_Y% of its height is above
// that point, so the remaining (100 - SCREEN_CENTRE_Y)% hangs below — putting
// its bottom edge at 50vh + 0.6769 x SIZE. Expressed as an inset from the
// bottom, that's the value below. The background band is pinned to it, so the
// band ends exactly where the console does at any viewport size, with no
// measuring at runtime.
const CONSOLE_BOTTOM_INSET = `calc(50vh - ${((100 - SCREEN_CENTRE_Y) / 100).toFixed(4)} * ${SIZE})`

export default function NewSitePage() {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-black">
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
