import { BlogPosts } from './components/posts'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Diane Stephani - Software Engineer
      </h1>
      <p className="mb-4">
        {`I’m a software engineer who loves making tools that actually make life easier—especially after years working as a personal trainer and in food service. I personally feel that a lot of software constraints and issues arise because the people building these tools and platforms are not the same people who are using them every single day. What separates me from other engineers is the fact that I'm the one using these services on the ground level, and I know how to improve them on a high level. My experience in customer service roles has taught me not only how to talk to clients to figure out what they really need, but also how to talk to my peers around me and figure out working solutions for the tools we use every day.`}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
