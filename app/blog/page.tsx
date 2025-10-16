import { BlogPosts } from '../components/posts'

export const metadata = {
  title: 'Projects',
  description: 'See my work for yourself.',
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Projects</h1>
      <BlogPosts />
    </section>
  )
}
