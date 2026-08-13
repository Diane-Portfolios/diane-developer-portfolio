import Image from 'next/image'
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

export default function NewSitePage() {
  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <NewSiteNav />

      {/* This wrapper owns the centring. It's given the console's exact box —
          height plus source aspect ratio — because the translate percentages
          resolve against the element's own size, so a full-width wrapper would
          shift it wrong. The image animates inside, transform-free. */}
      <div
        className="absolute left-1/2 top-1/2 z-10"
        style={{
          height: SIZE,
          aspectRatio: '812 / 1046',
          transform: `translate(-${SCREEN_CENTRE_X}%, -${SCREEN_CENTRE_Y}%)`,
        }}
      >
        <Image
          src="/assets/backgrounds/gameboy.png"
          alt=""
          aria-hidden
          width={812}
          height={1046}
          priority
          className="ns-enter-gameboy pointer-events-none h-full w-full select-none"
        />
      </div>
    </div>
  )
}
