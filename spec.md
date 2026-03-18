# Finnxstar Mortgage

## Current State
A single-page marketing website with sections: hero, services, about, how it works, eligibility, testimonials, FAQ, and a lead capture form. Backend stores leads submitted through the form. No blog or content management exists.

## Requested Changes (Diff)

### Add
- Blog post data type in backend: id, title, excerpt, content, author, imageUrl, category, publishedAt
- Backend functions: createPost (admin only), getAllPosts (public), getPost by id (public), deletePost (admin only)
- Public /blog page listing all published posts with cards (title, excerpt, date, category)
- Public /blog/:id page showing full blog post content
- Admin /admin/blog page (protected by authorization) for creating and managing blog posts
- Blog link in the main navigation

### Modify
- Nav bar: add "Blog" link
- App routing: support /blog and /blog/:id and /admin/blog routes

### Remove
- Nothing removed

## Implementation Plan
1. Select `authorization` component for admin-protected blog management
2. Update Motoko backend to add BlogPost type and CRUD functions with admin role guard
3. Update frontend: add routing, public blog list page, blog post detail page, admin blog editor page, update nav
