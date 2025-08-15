import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { blogPosts, searchBlogPosts, BlogPost } from '../data/blogPosts'
import '../styles/CommunityPage.css'

const CommunityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>(blogPosts)

  const categories = ['all', 'AI Strategy', 'Security', 'Innovation', 'Case Studies']

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const results = searchBlogPosts(searchQuery)
      setDisplayedPosts(results)
      setSelectedCategory('all')
    } else {
      setDisplayedPosts(blogPosts)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSearchQuery('')
    if (category === 'all') {
      setDisplayedPosts(blogPosts)
    } else {
      setDisplayedPosts(blogPosts.filter(post => post.category === category))
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setDisplayedPosts(blogPosts)
    setSelectedCategory('all')
  }

  return (
    <div className="community-page">
      <div className="community-hero">
        <div className="community-hero-content">
          <h1>Community Blog</h1>
          <p>Insights, best practices, and thought leadership on enterprise AI</p>
        </div>
      </div>

      <div className="community-container">
        <div className="community-filters">
          <form className="blog-search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="blog-search-input"
              />
              {searchQuery && (
                <button type="button" onClick={clearSearch} className="clear-search">
                  ×
                </button>
              )}
            </div>
            <button type="submit" className="search-submit">Search</button>
          </form>
          
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {displayedPosts.length === 0 ? (
          <div className="no-results">
            <h3>No articles found</h3>
            <p>Try adjusting your search terms or browse all articles</p>
            <button onClick={clearSearch} className="clear-search-btn">
              Browse All Articles
            </button>
          </div>
        ) : (
          <div className="blog-grid">
            {displayedPosts.map(post => (
              <article key={post.id} className="blog-card">
                <Link to={`/blog/${post.id}`} className="blog-card-link">
                  {post.image && (
                    <div className="blog-card-image">
                      <img src={post.image} alt={post.title} />
                    </div>
                  )}
                  <div className="blog-card-content">
                    <div className="blog-card-meta">
                      <span className="blog-category">{post.category}</span>
                      <span className="blog-read-time">{post.readTime}</span>
                    </div>
                    <h2 className="blog-card-title">{post.title}</h2>
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                    <div className="blog-card-footer">
                      <div className="blog-author">
                        <span className="author-name">{post.author}</span>
                        <span className="blog-date">{post.date}</span>
                      </div>
                      <span className="read-more-btn">Read More →</span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default CommunityPage