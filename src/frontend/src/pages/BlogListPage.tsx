import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import type { BlogPost } from "../backend.d";
import { useGetAllPosts } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const CATEGORY_COLORS: Record<string, string> = {
  "Dubai Real Estate": "bg-blue-100 text-blue-800",
  "Mortgage Tips": "bg-gold/20 text-yellow-800",
  "Expat Guide": "bg-green-100 text-green-800",
  "Market News": "bg-purple-100 text-purple-800",
  Finance: "bg-orange-100 text-orange-800",
};

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      data-ocid={`blog.item.${index + 1}`}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col"
    >
      {post.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      {!post.imageUrl && (
        <div className="h-48 bg-gradient-to-br from-navy/10 to-gold/20 flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-navy/30" />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {post.category}
          </span>
        </div>
        <h2 className="section-heading text-lg font-bold mb-2 leading-snug line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedAt)}
            </span>
          </div>
          <Link
            to="/blog/$id"
            params={{ id: post.id.toString() }}
            data-ocid={`blog.link.${index + 1}`}
            className="flex items-center gap-1 text-xs font-semibold text-navy hover:text-gold transition-colors"
          >
            Read more <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

export default function BlogListPage() {
  const { data: posts, isLoading } = useGetAllPosts();

  const sorted = [...(posts ?? [])].sort(
    (a, b) => Number(b.publishedAt) - Number(a.publishedAt),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy py-20 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-gold text-sm font-semibold tracking-widest uppercase mb-3">
              Insights & News
            </span>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
              The Finnxstar Blog
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Expert insights on Dubai real estate, mortgage tips, and financial
              guidance for residents and expats.
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading && (
          <div
            data-ocid="blog.loading_state"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && sorted.length === 0 && (
          <div data-ocid="blog.empty_state" className="text-center py-24">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="section-heading text-2xl mb-2">No posts yet</h3>
            <p className="text-gray-500">
              Check back soon for expert mortgage insights and Dubai market
              updates.
            </p>
          </div>
        )}

        {!isLoading && sorted.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sorted.map((post, i) => (
              <PostCard key={post.id.toString()} post={post} index={i} />
            ))}
          </div>
        )}
      </main>

      {/* Footer note */}
      <div className="text-center py-10 text-sm text-gray-400">
        © {new Date().getFullYear()}. Built with love using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          className="hover:text-gold transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          caffeine.ai
        </a>
      </div>
    </div>
  );
}
