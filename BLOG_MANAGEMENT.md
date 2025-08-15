# Blog Management Guide

This guide explains how to add, edit, and remove blog posts in the Symentic Web community blog system.

## Blog System Overview

The blog system is a static, data-driven implementation where all blog posts are stored in a single TypeScript file. The system automatically handles routing, display, search functionality, and related post suggestions.

**Key Files:**
- `src/data/blogPosts.ts` - Contains all blog post data
- `src/pages/CommunityPage.tsx` - Blog listing page
- `src/pages/BlogPostPage.tsx` - Individual blog post display

## Adding a New Blog Post

### Step 1: Open the Blog Data File
Navigate to `src/data/blogPosts.ts`

### Step 2: Add Your Blog Post Object
Add a new object to the `blogPosts` array (starting at line 15). Place it at the beginning of the array to appear first in the list.

### Step 3: Required Fields
Every blog post must include these fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | string | Unique URL-friendly identifier (no spaces, lowercase) | `"my-blog-post"` |
| `title` | string | Blog post title | `"Understanding AI Integration"` |
| `excerpt` | string | Short summary (shown in list view) | `"Learn how AI can transform..."` |
| `content` | string | Full article content with formatting | See content formatting section |
| `author` | string | Author's full name | `"Jane Smith"` |
| `authorRole` | string | Author's position/title | `"VP of Engineering"` |
| `date` | string | Publication date | `"January 20, 2025"` |
| `category` | string | Must be one of the allowed categories | `"AI Strategy"` |
| `readTime` | string | Estimated reading time | `"5 min read"` |
| `image` | string | Hero image URL (800px width recommended) | `"https://images.unsplash.com/..."` |
| `tags` | string[] | Array of relevant tags | `["AI", "Innovation", "Enterprise"]` |

### Step 4: Allowed Categories
Choose from these predefined categories:
- `"AI Strategy"`
- `"Security"`
- `"Innovation"`
- `"Case Studies"`

## Content Formatting

The content field supports markdown-like formatting:

### Headers
```markdown
# Main Title (H1)
## Section Title (H2)
### Subsection Title (H3)
```

### Text Formatting
```markdown
**Bold text**
Regular paragraph text
```

### Lists
```markdown
- Bullet point item
- Another item

1. Numbered item
2. Second item
```

### Paragraphs
Simply write text. Empty lines create paragraph breaks.

## Complete Example

```typescript
{
  id: "enterprise-ai-roadmap-2025",
  title: "Building Your Enterprise AI Roadmap for 2025",
  excerpt: "A comprehensive guide to planning and executing your organization's AI transformation journey in the coming year.",
  content: `
# Building Your Enterprise AI Roadmap for 2025

As we enter 2025, enterprises face unprecedented opportunities to leverage artificial intelligence for competitive advantage. This guide provides a practical framework for building your AI roadmap.

## Understanding the Current Landscape

The AI landscape has evolved dramatically over the past year. Organizations must consider:

- **Technological Maturity**: AI tools are now enterprise-ready
- **Regulatory Environment**: New compliance requirements are emerging
- **Talent Availability**: The skills gap is narrowing but still significant

## Key Components of an AI Roadmap

### 1. Assessment Phase

Begin with a thorough assessment of your current capabilities:

**Data Infrastructure**
Evaluate your data quality, accessibility, and governance structures.

**Technical Readiness**
Assess your existing technology stack and integration capabilities.

### 2. Strategic Planning

Define clear objectives aligned with business goals:

1. Identify high-value use cases
2. Prioritize based on ROI potential
3. Set measurable success metrics

## Implementation Timeline

### Q1: Foundation Building
- Establish governance framework
- Build core team
- Launch pilot projects

### Q2-Q3: Scaling
- Expand successful pilots
- Integrate with existing systems
- Train broader teams

### Q4: Optimization
- Measure results
- Refine approaches
- Plan for next phase

## Conclusion

Success in AI transformation requires careful planning, realistic expectations, and sustained commitment. Start small, measure results, and scale what works.
  `,
  author: "Alexandra Chen",
  authorRole: "Director of AI Strategy",
  date: "January 20, 2025",
  category: "AI Strategy",
  readTime: "7 min read",
  image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800",
  tags: ["AI Strategy", "Digital Transformation", "Roadmap", "Enterprise", "2025 Planning"]
}
```

## Removing a Blog Post

To remove a blog post, simply delete its entire object from the `blogPosts` array in `src/data/blogPosts.ts`.

## Editing Existing Posts

To edit a blog post, locate its object in the `blogPosts` array by its `id` and modify any fields as needed.

## Best Practices

### Content Guidelines
- Keep excerpts under 200 characters for optimal display
- Use descriptive, SEO-friendly IDs
- Include 3-5 relevant tags per post
- Ensure images are high quality and relevant

### Image Recommendations
- Use landscape orientation images
- Recommended size: 800px width minimum
- Unsplash provides free, high-quality images
- Always use HTTPS URLs for images

### Writing Tips
- Start with a compelling introduction
- Use headers to structure content logically
- Include practical examples and actionable insights
- Keep paragraphs concise and scannable
- End with a clear conclusion or call-to-action

## How the System Works

1. **Display**: Blog posts are automatically displayed on `/community` page
2. **Routing**: Each post is accessible at `/blog/{id}`
3. **Search**: Full-text search across title, excerpt, content, tags, and category
4. **Filtering**: Users can filter by category
5. **Related Posts**: System automatically suggests related posts based on category

## Troubleshooting

### Post Not Appearing
- Ensure the object is properly added to the `blogPosts` array
- Check for syntax errors (missing commas, quotes, etc.)
- Verify all required fields are present

### Formatting Issues
- Check that markdown syntax is correct
- Ensure proper escaping of special characters in content
- Verify image URLs are valid and accessible

### URL Issues
- Ensure the `id` field contains no spaces or special characters
- Use hyphens instead of underscores for better SEO

## Additional Features

### Search Functionality
The blog system includes built-in search that checks:
- Title
- Excerpt
- Full content
- Tags
- Category

### Related Posts
The system automatically displays up to 3 related posts from the same category at the bottom of each blog post.

### Category Filtering
Users can filter posts by category using the buttons on the Community page.

## Support

For additional help or to report issues with the blog system, please contact the development team.