import { useGetAllPosts } from "../hooks/useQueries";

const BASE_URLS = [
  { loc: "https://finnxstar.com/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://finnxstar.com/blog", changefreq: "daily", priority: "0.8" },
  {
    loc: "https://mortgage-broker-dubai-kqq.caffeine.xyz/",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    loc: "https://mortgage-broker-dubai-kqq.caffeine.xyz/blog",
    changefreq: "daily",
    priority: "0.8",
  },
];

export default function SitemapPage() {
  const { data: posts, isLoading } = useGetAllPosts();

  const publishedPosts = (posts ?? []).filter(
    (p: any) => p.status === "published",
  );

  return (
    <div className="min-h-screen bg-navy text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <span className="text-gold text-sm font-semibold tracking-widest uppercase">
            SEO
          </span>
          <h1 className="font-display text-4xl font-bold mt-2 mb-3">
            Live Sitemap
          </h1>
          <p className="text-white/60">
            This page dynamically lists all published blog posts. Submit{" "}
            <a
              href="/sitemap.xml"
              className="text-gold underline underline-offset-2 hover:text-gold/80"
            >
              /sitemap.xml
            </a>{" "}
            to Google Search Console for static pages, or submit this page URL{" "}
            <code className="text-gold text-sm bg-white/10 px-1 py-0.5 rounded">
              /sitemap
            </code>{" "}
            for a full dynamic listing of all posts.
          </p>
        </div>

        <section className="mb-10">
          <h2 className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">
            Main Pages
          </h2>
          <div className="space-y-2">
            {BASE_URLS.map((u) => (
              <div
                key={u.loc}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-4 py-3"
              >
                <a
                  href={u.loc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-gold text-sm font-mono break-all"
                >
                  {u.loc}
                </a>
                <span className="text-white/40 text-xs ml-4 shrink-0">
                  priority {u.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-gold font-semibold text-sm tracking-widest uppercase mb-4">
            Blog Posts{" "}
            {!isLoading && (
              <span className="text-white/40 font-normal normal-case tracking-normal">
                ({publishedPosts.length})
              </span>
            )}
          </h2>
          {isLoading ? (
            <div
              className="text-white/40 text-sm py-4"
              data-ocid="sitemap.loading_state"
            >
              Loading posts...
            </div>
          ) : publishedPosts.length === 0 ? (
            <div
              className="text-white/40 text-sm py-4 bg-white/5 border border-white/10 rounded-lg px-4"
              data-ocid="sitemap.empty_state"
            >
              No published posts yet. Posts will appear here when published.
            </div>
          ) : (
            <div className="space-y-2" data-ocid="sitemap.list">
              {publishedPosts.map((post: any, i: number) => (
                <div
                  key={post.id?.toString()}
                  data-ocid={`sitemap.item.${i + 1}`}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-3"
                >
                  <div className="font-medium text-white/90 text-sm mb-2">
                    {post.title}
                  </div>
                  <div className="space-y-1">
                    <a
                      href={`https://finnxstar.com/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white/60 hover:text-gold text-xs font-mono break-all"
                    >
                      https://finnxstar.com/blog/{post.slug}
                    </a>
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white/60 hover:text-gold text-xs font-mono break-all"
                    >
                      https://mortgage-broker-dubai-kqq.caffeine.xyz/blog/
                      {post.slug}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
