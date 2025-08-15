import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock, User, Tag, Share2, BookOpen } from 'lucide-react'
import { getBlogPost, getRelatedPosts, BlogPost } from '../data/blogPosts'
import '../styles/BlogPostPage.css'

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<BlogPost | undefined>()
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const blogPost = getBlogPost(id)
      setPost(blogPost)
      
      if (blogPost) {
        setRelatedPosts(getRelatedPosts(id, blogPost.category))
        window.scrollTo(0, 0)
      }
      setLoading(false)
    }
  }, [id])

  const handleShare = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL')
    }
  }

  const formatContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: JSX.Element[] = []
    let listItems: string[] = []

    const closeList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={elements.length}>
            {listItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )
        listItems = []
      }
    }

    lines.forEach((line, index) => {
      const trimmedLine = line.trim()

      if (trimmedLine.startsWith('# ')) {
        closeList()
        elements.push(
          <h1 key={index} className="blog-content-h1">
            {trimmedLine.substring(2)}
          </h1>
        )
      } else if (trimmedLine.startsWith('## ')) {
        closeList()
        elements.push(
          <h2 key={index} className="blog-content-h2">
            {trimmedLine.substring(3)}
          </h2>
        )
      } else if (trimmedLine.startsWith('### ')) {
        closeList()
        elements.push(
          <h3 key={index} className="blog-content-h3">
            {trimmedLine.substring(4)}
          </h3>
        )
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        closeList()
        const boldText = trimmedLine.substring(2, trimmedLine.length - 2)
        elements.push(
          <p key={index} className="blog-content-bold">
            {boldText}
          </p>
        )
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ')) {
        listItems.push(trimmedLine.substring(2))
      } else if (trimmedLine.match(/^\d+\.\s/)) {
        closeList()
        elements.push(
          <p key={index} className="blog-content-numbered">
            {trimmedLine}
          </p>
        )
      } else if (trimmedLine === '') {
        closeList()
        elements.push(<br key={index} />)
      } else {
        closeList()
        const processedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        elements.push(
          <p 
            key={index} 
            className="blog-content-paragraph"
            dangerouslySetInnerHTML={{ __html: processedLine }}
          />
        )
      }
    })

    closeList()
    return elements
  }

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-post-error">
        <h1>Blog post not found</h1>
        <Link to="/community" className="back-to-blog">
          <ArrowLeft size={20} />
          Back to Community
        </Link>
      </div>
    )
  }

  return (
    <div className="blog-post-page">
      <div className="blog-post-header">
        <div className="blog-post-nav">
          <button onClick={handleShare} className="share-button">
            <Share2 size={20} />
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      <article className="blog-post-container">
        {post.image && (
          <div className="blog-post-hero">
            <img src={post.image} alt={post.title} className="blog-post-image" />
          </div>
        )}

        <div className="blog-post-content-wrapper">
          <header className="blog-post-meta-header">
            <div className="blog-post-category-badge">{post.category}</div>
            <h1 className="blog-post-title">{post.title}</h1>
            
            <div className="blog-post-meta-info">
              <div className="blog-post-author">
                <User size={16} />
                <div>
                  <span className="author-name">{post.author}</span>
                  <span className="author-role">{post.authorRole}</span>
                </div>
              </div>
              <div className="blog-post-date">
                <Clock size={16} />
                <span>{post.date}</span>
              </div>
              <div className="blog-post-read-time">
                <BookOpen size={16} />
                <span>{post.readTime}</span>
              </div>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="blog-post-tags">
                <Tag size={16} />
                {post.tags.map((tag, index) => (
                  <span key={index} className="blog-post-tag">{tag}</span>
                ))}
              </div>
            )}
          </header>

          <div className="blog-post-content">
            {formatContent(post.content)}
          </div>

          {relatedPosts.length > 0 && (
            <section className="related-posts">
              <h2>Related Articles</h2>
              <div className="related-posts-grid">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    to={`/blog/${relatedPost.id}`}
                    className="related-post-card"
                  >
                    <img src={relatedPost.image} alt={relatedPost.title} />
                    <div className="related-post-content">
                      <span className="related-post-category">{relatedPost.category}</span>
                      <h3>{relatedPost.title}</h3>
                      <span className="related-post-read-time">{relatedPost.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  )
}

export default BlogPostPage