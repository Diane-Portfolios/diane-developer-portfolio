import { BlogPosts } from './components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Diane Stephani - Software Engineer
      </h1>
      <p className="mb-4">
        {`I’m a software engineer who loves making tools that actually make life easier—especially after years working as a personal trainer and in food service. I’ve worked with everything from gym software to restaurant POS systems, so I know how to turn real-world headaches into smooth solutions. I also love talking to clients and figuring out exactly what they need, which makes the software I build both useful and easy to use.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
