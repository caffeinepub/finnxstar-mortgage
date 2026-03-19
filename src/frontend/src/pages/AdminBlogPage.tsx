import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Copy,
  Loader2,
  Lock,
  LogIn,
  PenLine,
  Plus,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import RichTextEditor from "../components/RichTextEditor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreatePost,
  useDeletePost,
  useGetAllPosts,
  useIsCallerAdmin,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Dubai Real Estate",
  "Mortgage Tips",
  "Expat Guide",
  "Market News",
  "Finance",
];

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  imageUrl: "",
  category: "",
};

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminBlogPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: posts, isLoading: loadingPosts } = useGetAllPosts();
  const createPost = useCreatePost();
  const deletePost = useDeletePost();

  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const principalId = identity?.getPrincipal().toText() ?? "";

  function copyPrincipal() {
    navigator.clipboard.writeText(principalId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    });
  }

  function setField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      !form.title ||
      !form.excerpt ||
      !form.content ||
      !form.author ||
      !form.category
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await createPost.mutateAsync(form);
      toast.success("Post published!");
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      toast.error("Failed to publish post.");
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost.mutateAsync(id);
      toast.success("Post deleted.");
    } catch {
      toast.error("Failed to delete post.");
    }
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-navy/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Lock className="w-8 h-8 text-navy" />
          </div>
          <h2 className="section-heading text-2xl mb-2">Admin Access</h2>
          <p className="text-gray-500 mb-8">
            Sign in to manage blog posts for the Finnxstar website.
          </p>
          <Button
            data-ocid="admin.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="btn-gold w-full rounded-full py-3 text-base"
          >
            {isLoggingIn ? (
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="mr-2 w-4 h-4" />
            )}
            {isLoggingIn ? "Signing in..." : "Sign In"}
          </Button>
        </motion.div>
      </div>
    );
  }

  // Checking admin status
  if (checkingAdmin) {
    return (
      <div
        data-ocid="admin.loading_state"
        className="min-h-screen bg-gray-50 flex items-center justify-center pt-20"
      >
        <Loader2 className="w-10 h-10 text-gold animate-spin" />
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div
        data-ocid="admin.error_state"
        className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full"
        >
          {/* Amber instruction banner */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm font-medium leading-snug">
              To get admin access, copy your Principal ID below and send it to
              your <span className="font-bold">Finnxstar support contact</span>.
            </p>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h2 className="section-heading text-2xl mb-1">Unauthorized</h2>
            <p className="text-gray-500 text-sm">
              Your account does not have admin permissions for this dashboard.
            </p>
          </div>

          {/* Principal ID box */}
          <div className="bg-gray-50 border-2 border-navy/20 rounded-xl p-5">
            <p className="text-sm font-bold text-navy uppercase tracking-wider mb-3">
              Your Principal ID
            </p>

            {principalId === "" ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 text-navy animate-spin" />
                <span className="ml-2 text-sm text-gray-400">
                  Loading your ID...
                </span>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-4">
                <p className="font-mono text-base font-bold text-navy break-all leading-relaxed select-all">
                  {principalId}
                </p>
              </div>
            )}

            {/* Full-width copy button */}
            <Button
              data-ocid="admin.primary_button"
              type="button"
              onClick={copyPrincipal}
              disabled={principalId === ""}
              className="w-full btn-gold rounded-xl py-3 text-base font-semibold"
            >
              {copied ? (
                <CheckCircle2 className="mr-2 w-5 h-5" />
              ) : (
                <Copy className="mr-2 w-5 h-5" />
              )}
              {copied ? "Copied!" : "Copy Principal ID to Clipboard"}
            </Button>

            {/* Success message after copy */}
            <AnimatePresence>
              {copied && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 text-sm font-semibold text-center mt-3"
                >
                  ✓ Copied! Now paste it in the chat to get admin access.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    );
  }

  const sortedPosts = [...(posts ?? [])].sort(
    (a, b) => Number(b.publishedAt) - Number(a.publishedAt),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                Admin
              </span>
              <h1 className="font-display text-3xl font-bold text-white mt-1">
                Blog Management
              </h1>
            </div>
            <Button
              data-ocid="admin.open_modal_button"
              onClick={() => setShowForm((v) => !v)}
              className="btn-gold rounded-full px-5"
            >
              {showForm ? (
                "Cancel"
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" /> New Post
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              data-ocid="admin.panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-10"
            >
              <div className="bg-white rounded-2xl shadow border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <PenLine className="w-5 h-5 text-gold" />
                  <h2 className="section-heading text-xl">Create New Post</h2>
                </div>
                <form
                  data-ocid="admin.modal"
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        data-ocid="admin.input"
                        placeholder="Post title"
                        value={form.title}
                        onChange={(e) => setField("title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="author">Author *</Label>
                      <Input
                        id="author"
                        data-ocid="admin.input"
                        placeholder="Author name"
                        value={form.author}
                        onChange={(e) => setField("author", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => setField("category", v)}
                      >
                        <SelectTrigger data-ocid="admin.select" id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="imageUrl">Image URL (optional)</Label>
                      <Input
                        id="imageUrl"
                        data-ocid="admin.input"
                        placeholder="https://..."
                        value={form.imageUrl}
                        onChange={(e) => setField("imageUrl", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      data-ocid="admin.textarea"
                      placeholder="Short summary shown in blog list..."
                      rows={2}
                      value={form.excerpt}
                      onChange={(e) => setField("excerpt", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="content">Content *</Label>
                    <RichTextEditor
                      value={form.content}
                      onChange={(html) => setField("content", html)}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      data-ocid="admin.cancel_button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      data-ocid="admin.submit_button"
                      disabled={createPost.isPending}
                      className="btn-gold rounded-full px-8"
                    >
                      {createPost.isPending ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : null}
                      {createPost.isPending ? "Publishing..." : "Publish Post"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-navy" />
            <h2 className="section-heading text-lg">
              Published Posts ({sortedPosts.length})
            </h2>
          </div>

          {loadingPosts ? (
            <div data-ocid="admin.loading_state" className="p-10 text-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
            </div>
          ) : sortedPosts.length === 0 ? (
            <div data-ocid="admin.empty_state" className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">
                No posts yet. Create your first post above.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {sortedPosts.map((post, i) => (
                <motion.li
                  key={post.id.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  data-ocid={`admin.item.${i + 1}`}
                  className="flex items-start sm:items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-navy truncate">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="bg-gold/20 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span>by {post.author}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-ocid={`admin.delete_button.${i + 1}`}
                    onClick={() => handleDelete(post.id)}
                    disabled={deletePost.isPending}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
