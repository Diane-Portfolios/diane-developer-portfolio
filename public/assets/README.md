# Assets

Large binary assets for the site. Everything under `public/` is served statically
by Next.js at a URL matching its path, with `public/` stripped:

```
public/assets/backgrounds/hero.webp   ->   /assets/backgrounds/hero.webp
```

```tsx
import Image from 'next/image'

<Image src="/assets/backgrounds/hero.webp" alt="" fill priority />
```

Reference assets by that absolute URL path — never by a relative import or a
filesystem path.

## Layout

| Directory     | For                                                  |
| ------------- | ---------------------------------------------------- |
| `backgrounds/`| Background images, textures, hero art                 |
| `animations/` | Lottie `.json`, Rive `.riv`, animated GIF/WebP        |
| `video/`      | Background video, clips (`.mp4`, `.webm`)             |

Small SVGs (icons, logos) don't belong here — keep those as components or in
`public/` directly. They're text, they diff well, and LFS costs more than it
saves on them.

## Git LFS

Files in this directory are tracked by Git LFS. See the patterns in the repo
root [`.gitattributes`](../../.gitattributes). Adding a file is normal `git add`
— the LFS filter picks it up automatically based on extension.

Confirm a file went to LFS before pushing:

```bash
git lfs status      # staged files, and whether they're LFS or not
git lfs ls-files    # everything currently tracked by LFS
```

**Adding a new file type:** add the pattern to `.gitattributes` *before* the
first commit of that file. Converting an already-committed file to LFS means
rewriting history, which is a much worse afternoon.

## Deployment note

Vercel supports Git LFS, but it is **off by default**. It must be enabled per
project in Vercel's project settings, followed by a redeploy. Without that,
Vercel deploys the LFS pointer files — small text stubs — instead of the real
images, and every asset on the site breaks.
