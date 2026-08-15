import { Press_Start_2P } from 'next/font/google'

// Approximation of the Game Boy boot wordmark. That lettering is a bitmap in
// Nintendo's boot ROM rather than a typeface anyone can license, so this is the
// closest freely-licensed stand-in (OFL). next/font downloads and self-hosts it
// at build time, so there's no request to Google at runtime.
export const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  // Anything the pixel face lacks — diacritics, CJK — falls through to these
  // rather than to a proportional UI font.
  fallback: ['ui-monospace', 'monospace'],
})
