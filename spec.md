# Finnxstar Mortgage

## Current State
The blog admin (`AdminBlogPage.tsx`) uses a plain `<Textarea>` for post content. No formatting is available. `BlogPostPage.tsx` renders content as plain paragraphs split by newlines.

## Requested Changes (Diff)

### Add
- Rich text editor (contenteditable-based) in the blog admin with a toolbar: Bold, Italic, Underline, font size selector (Small/Normal/Large/Heading), ordered list, unordered list, hyperlink insertion, and a clear-format option.
- The editor stores content as HTML.

### Modify
- Replace the `<Textarea>` for "Content" field in `AdminBlogPage.tsx` with the new rich text editor component.
- Update `BlogPostPage.tsx` to render post content using `dangerouslySetInnerHTML` so HTML formatting (bold, lists, links, etc.) displays correctly.

### Remove
- The old plain-text paragraph-splitting render logic in `BlogPostPage.tsx`.

## Implementation Plan
1. Create `src/frontend/src/components/RichTextEditor.tsx` -- a self-contained contenteditable editor with a formatting toolbar.
2. Import and use `RichTextEditor` in `AdminBlogPage.tsx` replacing the content `<Textarea>`.
3. Update `BlogPostPage.tsx` content renderer to use `dangerouslySetInnerHTML={{ __html: post.content }}`.
