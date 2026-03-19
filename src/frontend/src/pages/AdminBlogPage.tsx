import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Eye,
  Loader2,
  Lock,
  LogIn,
  PenLine,
  Pencil,
  Plus,
  Search,
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
  useUpdatePost,
} from "../hooks/useQueries";

const CATEGORIES = [
  "Dubai Real Estate",
  "Mortgage Tips",
  "Expat Guide",
  "Market News",
  "Finance",
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  author: "",
  imageUrl: "",
  category: "",
  status: "published" as "published" | "draft",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

type Post = {
  id: bigint;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  imageUrl: string;
  category: string;
  publishedAt: bigint;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
};

function formatDate(ts: bigint) {
  return new Date(Number(ts)).toLocaleDateString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function stripHtml(html: string) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent ?? tmp.innerText ?? "";
}

export default function AdminBlogPage() {
  const { login, loginStatus, identity } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  const isAuthenticated = !!identity;

  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();
  const { data: posts, isLoading: loadingPosts } = useGetAllPosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewPost, setPreviewPost] = useState<Post | null>(null);

  const principalId = identity?.getPrincipal().toText() ?? "";

  function copyPrincipal() {
    navigator.clipboard.writeText(principalId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    });
  }

  function setField(field: string, value: string) {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "title" && !slugManuallyEdited) {
        updated.slug = generateSlug(value);
      }
      if (field === "slug") {
        setSlugManuallyEdited(value !== "");
      }
      return updated;
    });
  }

  function openCreateForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEditForm(post: Post) {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      imageUrl: post.imageUrl,
      category: post.category,
      status: "published",
      slug: post.slug ?? "",
      metaTitle: post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
      metaKeywords: post.metaKeywords ?? "",
    });
    setSlugManuallyEdited(true);
    setEditingId(post.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSlugManuallyEdited(false);
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
    const slug = form.slug || generateSlug(form.title);
    try {
      if (editingId !== null) {
        await updatePost.mutateAsync({
          id: editingId,
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          imageUrl: form.imageUrl,
          category: form.category,
          slug,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          metaKeywords: form.metaKeywords,
        });
        toast.success("Post updated!");
      } else {
        await createPost.mutateAsync({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          author: form.author,
          imageUrl: form.imageUrl,
          category: form.category,
          slug,
          metaTitle: form.metaTitle,
          metaDescription: form.metaDescription,
          metaKeywords: form.metaKeywords,
        });
        toast.success("Post published!");
      }
      cancelForm();
    } catch {
      toast.error(
        editingId !== null
          ? "Failed to update post."
          : "Failed to publish post.",
      );
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Delete this post? This action cannot be undone.")) return;
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
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-amber-800 text-sm font-medium leading-snug">
              To get admin access, copy your Principal ID below and send it to
              your <span className="font-bold">Finnxstar support contact</span>.
            </p>
          </div>
          <div className="text-center mb-6">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h2 className="section-heading text-2xl mb-1">Unauthorized</h2>
            <p className="text-gray-500 text-sm">
              Your account does not have admin permissions for this dashboard.
            </p>
          </div>
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

  const filteredPosts = sortedPosts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const publishedCount = sortedPosts.length;
  const isSaving = createPost.isPending || updatePost.isPending;
  const isEditing = editingId !== null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy pt-24 pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-gold text-sm font-semibold tracking-widest uppercase">
                Admin
              </span>
              <h1 className="font-display text-3xl font-bold text-white mt-1">
                Blog Management
              </h1>
              <p className="text-white/60 text-sm mt-1">
                {publishedCount === 0
                  ? "No posts yet"
                  : `${publishedCount} post${publishedCount === 1 ? "" : "s"} published`}
              </p>
            </div>
            <Button
              data-ocid="admin.open_modal_button"
              onClick={showForm ? cancelForm : openCreateForm}
              className="btn-gold rounded-full px-5 shrink-0"
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
        {/* Create / Edit Form */}
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
                  <h2 className="section-heading text-xl">
                    {isEditing ? "Edit Post" : "Create New Post"}
                  </h2>
                  {isEditing && (
                    <Badge
                      variant="outline"
                      className="ml-auto text-gold border-gold/40"
                    >
                      Editing
                    </Badge>
                  )}
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={form.status}
                        onValueChange={(v) => setField("status", v)}
                      >
                        <SelectTrigger data-ocid="admin.select" id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="imageUrl">Cover Image URL</Label>
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

                  {/* SEO Settings */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-5 bg-gold rounded-full" />
                      <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
                        SEO Settings
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="slug">URL Slug *</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                            /blog/
                          </span>
                          <Input
                            id="slug"
                            data-ocid="admin.input"
                            placeholder="your-post-url-here"
                            value={form.slug}
                            onChange={(e) => setField("slug", e.target.value)}
                            className="pl-14"
                          />
                        </div>
                        <p className="text-xs text-gray-400">
                          Auto-generated from title. Used in the URL: /blog/
                          {form.slug || "your-slug-here"}
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="metaTitle">Meta Title</Label>
                        <Input
                          id="metaTitle"
                          data-ocid="admin.input"
                          placeholder="Shown in browser tab & search results (defaults to title)"
                          value={form.metaTitle}
                          onChange={(e) =>
                            setField("metaTitle", e.target.value)
                          }
                        />
                        <p className="text-xs text-gray-400">
                          {form.metaTitle.length}/60 characters recommended
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="metaDescription">
                          Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          data-ocid="admin.textarea"
                          placeholder="Short description shown in Google search results..."
                          rows={3}
                          value={form.metaDescription}
                          onChange={(e) =>
                            setField("metaDescription", e.target.value)
                          }
                        />
                        <p className="text-xs text-gray-400">
                          {form.metaDescription.length}/160 characters
                          recommended
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="metaKeywords">Meta Keywords</Label>
                        <Textarea
                          id="metaKeywords"
                          data-ocid="admin.textarea"
                          placeholder="dubai mortgage, home loan, expat mortgage (comma-separated)"
                          rows={3}
                          value={form.metaKeywords}
                          onChange={(e) =>
                            setField("metaKeywords", e.target.value)
                          }
                        />
                        <p className="text-xs text-gray-400">
                          Comma-separated keywords for search engines
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      type="button"
                      data-ocid="admin.cancel_button"
                      variant="outline"
                      onClick={cancelForm}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      data-ocid="admin.submit_button"
                      disabled={isSaving}
                      className="btn-gold rounded-full px-8"
                    >
                      {isSaving ? (
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                      ) : null}
                      {isSaving
                        ? isEditing
                          ? "Saving..."
                          : "Publishing..."
                        : isEditing
                          ? "Save Changes"
                          : "Publish Post"}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
          {/* List Header with search */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-navy" />
                <h2 className="section-heading text-lg">Posts</h2>
                <Badge className="bg-navy/10 text-navy hover:bg-navy/10 font-semibold">
                  {publishedCount}
                </Badge>
              </div>
              <div className="sm:ml-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  data-ocid="admin.search_input"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            </div>
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
          ) : filteredPosts.length === 0 ? (
            <div data-ocid="admin.empty_state" className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">No posts match your search.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredPosts.map((post, i) => (
                <motion.li
                  key={post.id.toString()}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  data-ocid={`admin.item.${i + 1}`}
                  className="flex items-start sm:items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Cover thumbnail */}
                  {post.imageUrl ? (
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-14 h-14 object-cover rounded-lg shrink-0 hidden sm:block"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-navy/5 rounded-lg shrink-0 hidden sm:flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-navy/30" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-navy truncate">
                        {post.title}
                      </p>
                      {/* Status badge -- frontend-only concept */}
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs font-medium border-0">
                        Published
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span className="bg-gold/20 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedAt)}
                      </span>
                      <span>by {post.author}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                      {stripHtml(post.excerpt)}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      data-ocid={`admin.secondary_button.${i + 1}`}
                      onClick={() => setPreviewPost(post as Post)}
                      className="text-gray-500 hover:text-navy hover:bg-navy/5"
                      title="Preview post"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-ocid={`admin.edit_button.${i + 1}`}
                      onClick={() => openEditForm(post as Post)}
                      className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                      title="Edit post"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-ocid={`admin.delete_button.${i + 1}`}
                      onClick={() => handleDelete(post.id)}
                      disabled={deletePost.isPending}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Post Preview Dialog */}
      <Dialog
        open={!!previewPost}
        onOpenChange={(open) => !open && setPreviewPost(null)}
      >
        <DialogContent
          data-ocid="admin.dialog"
          className="max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle className="text-navy font-display text-xl">
              {previewPost?.title}
            </DialogTitle>
          </DialogHeader>

          {previewPost && (
            <div className="space-y-4">
              {/* Meta */}
              <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
                <span className="bg-gold/20 text-yellow-800 px-2 py-0.5 rounded-full font-medium text-xs">
                  {previewPost.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(previewPost.publishedAt)}
                </span>
                <span>
                  by <strong>{previewPost.author}</strong>
                </span>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0 text-xs">
                  Published
                </Badge>
              </div>

              {/* Cover image */}
              {previewPost.imageUrl && (
                <img
                  src={previewPost.imageUrl}
                  alt={previewPost.title}
                  className="w-full h-56 object-cover rounded-xl"
                />
              )}

              {/* Excerpt */}
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gold">
                <p className="text-gray-700 italic text-sm leading-relaxed">
                  {stripHtml(previewPost.excerpt)}
                </p>
              </div>

              {/* Full content rendered as HTML */}
              <div
                className="prose prose-navy max-w-none text-gray-700 leading-relaxed"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text content from trusted admin
                dangerouslySetInnerHTML={{ __html: previewPost.content }}
              />

              <div className="flex justify-end pt-2">
                <Button
                  data-ocid="admin.close_button"
                  variant="outline"
                  onClick={() => setPreviewPost(null)}
                >
                  Close Preview
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
