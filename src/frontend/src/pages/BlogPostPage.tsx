import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Tag, User } from "lucide-react";
import { motion } from "motion/react";
import { useGetPost } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPostPage() {
  const { id } = useParams({ from: "/blog/$id" });
  const postId = BigInt(id);
  const { data: post, isLoading } = useGetPost(postId);

  if (isLoading) {
    return (
      <div
        data-ocid="blogpost.loading_state"
        className="min-h-screen bg-gray-50 flex items-center justify-center pt-20"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div
        data-ocid="blogpost.error_state"
        className="min-h-screen bg-gray-50 flex items-center justify-center pt-20"
      >
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="section-heading text-2xl mb-2">Post not found</h2>
          <p className="text-gray-500 mb-6">This post may have been removed.</p>
          <Link
            to="/blog"
            data-ocid="blogpost.link"
            className="text-navy font-semibold hover:text-gold transition-colors flex items-center gap-2 justify-center"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-navy pt-24 pb-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/blog"
              data-ocid="blogpost.link"
              className="inline-flex items-center gap-2 text-white/60 hover:text-gold transition-colors text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <span className="inline-block bg-gold/20 text-gold text-xs font-semibold px-3 py-1 rounded-full mb-4">
              {post.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" /> {post.category}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-72 object-cover rounded-2xl mb-10 shadow-md"
            />
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
            <p className="text-lg text-gray-700 font-medium leading-relaxed mb-8 border-l-4 border-gold pl-5 italic">
              {post.excerpt}
            </p>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {post.content
                .split("\n")
                .filter(Boolean)
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mb-5">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Link
              to="/blog"
              data-ocid="blogpost.secondary_button"
              className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-full font-semibold hover:bg-navy/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> More Articles
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
