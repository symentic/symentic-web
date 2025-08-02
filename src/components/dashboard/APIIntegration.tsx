import React, { useState } from 'react'
import { Code, Search, Tag, Copy, CheckCircle } from 'lucide-react'
import styles from '../../styles/dashboard/Dashboard.module.css'

interface APIIntegrationProps {
  onClose?: () => void
}

export const APIIntegration: React.FC<APIIntegrationProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('query')
  const [queryType, setQueryType] = useState('name')
  const [nameQuery, setNameQuery] = useState('')
  const [tagsQuery, setTagsQuery] = useState('')
  const [businessId, setBusinessId] = useState('')
  const [results, setResults] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

  const handleQuery = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      let url = `${API_BASE_URL}/profiles/query?`
      const params = new URLSearchParams()

      if (queryType === 'name' && nameQuery) {
        params.append('name', nameQuery)
      } else if (queryType === 'tags' && tagsQuery) {
        const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
        tags.forEach(tag => params.append('tags', tag))
      } else if (queryType === 'both' && (nameQuery || tagsQuery)) {
        if (nameQuery) params.append('name', nameQuery)
        if (tagsQuery) {
          const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
          tags.forEach(tag => params.append('tags', tag))
        }
      }

      if (businessId) params.append('businessId', businessId)

      const response = await fetch(url + params.toString())
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getEndpointUrl = () => {
    let url = `${API_BASE_URL}/profiles/query?`
    const params = new URLSearchParams()

    if (queryType === 'name' && nameQuery) {
      params.append('name', nameQuery)
    } else if (queryType === 'tags' && tagsQuery) {
      const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
      tags.forEach(tag => params.append('tags', tag))
    } else if (queryType === 'both' && (nameQuery || tagsQuery)) {
      if (nameQuery) params.append('name', nameQuery)
      if (tagsQuery) {
        const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
        tags.forEach(tag => params.append('tags', tag))
      }
    }

    if (businessId) params.append('businessId', businessId)

    return url + params.toString()
  }

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  const renderQueryBuilder = () => (
    <div className={styles.apiQueryBuilder}>
      <div className={styles.queryTypeSelector}>
        <label>Query Type:</label>
        <select 
          value={queryType} 
          onChange={(e) => setQueryType(e.target.value)}
          className={styles.select}
        >
          <option value="name">By Name</option>
          <option value="tags">By Tags</option>
          <option value="both">By Name & Tags</option>
        </select>
      </div>

      {(queryType === 'name' || queryType === 'both') && (
        <div className={styles.inputGroup}>
          <label>Name Query:</label>
          <input
            type="text"
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder="Search by name, email, or role"
            className={styles.input}
          />
        </div>
      )}

      {(queryType === 'tags' || queryType === 'both') && (
        <div className={styles.inputGroup}>
          <label>Tags (comma-separated):</label>
          <input
            type="text"
            value={tagsQuery}
            onChange={(e) => setTagsQuery(e.target.value)}
            placeholder="developer, frontend, senior"
            className={styles.input}
          />
        </div>
      )}

      <div className={styles.inputGroup}>
        <label>Business ID (optional):</label>
        <input
          type="text"
          value={businessId}
          onChange={(e) => setBusinessId(e.target.value)}
          placeholder="T096L62N0MB"
          className={styles.input}
        />
      </div>

      <div className={styles.endpointPreview}>
        <label>Endpoint:</label>
        <div className={styles.endpointBox}>
          <code className={styles.endpoint}>{getEndpointUrl()}</code>
          <button
            className={styles.copyButton}
            onClick={() => copyToClipboard(getEndpointUrl(), 'endpoint')}
            title="Copy endpoint"
          >
            {copiedEndpoint === 'endpoint' ? <CheckCircle size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      <button
        className={styles.queryButton}
        onClick={handleQuery}
        disabled={isLoading || (!nameQuery && !tagsQuery)}
      >
        {isLoading ? 'Querying...' : 'Execute Query'}
      </button>
    </div>
  )

  const renderResults = () => {
    if (error) {
      return (
        <div className={styles.apiError}>
          <h4>Error:</h4>
          <p>{error}</p>
        </div>
      )
    }

    if (!results) return null

    return (
      <div className={styles.apiResults}>
        <div className={styles.resultsHeader}>
          <h4>Results ({results.count || 0} profiles)</h4>
          <button
            className={styles.copyButton}
            onClick={() => copyToClipboard(JSON.stringify(results, null, 2), 'results')}
            title="Copy results"
          >
            {copiedEndpoint === 'results' ? <CheckCircle size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <pre className={styles.jsonResults}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>
    )
  }

  const renderDocumentation = () => (
    <div className={styles.apiDocs}>
      <h3>API Endpoints</h3>
      
      <div className={styles.docSection}>
        <h4>Query Profiles</h4>
        <code className={styles.endpointCode}>GET /api/profiles/query</code>
        <p>Query profiles by name and/or tags with pagination support.</p>
        
        <h5>Query Parameters:</h5>
        <ul className={styles.paramsList}>
          <li><strong>name</strong> (string): Search by name, email, or role</li>
          <li><strong>tags</strong> (array): Filter by tags (can be repeated)</li>
          <li><strong>businessId</strong> (string): Filter by business ID</li>
          <li><strong>limit</strong> (number): Results per page (default: 100)</li>
          <li><strong>lastKey</strong> (string): Pagination token</li>
        </ul>

        <h5>Example:</h5>
        <code className={styles.exampleCode}>
          GET /api/profiles/query?name=john&tags=developer&tags=senior
        </code>
      </div>

      <div className={styles.docSection}>
        <h4>List All Profiles</h4>
        <code className={styles.endpointCode}>GET /api/profiles</code>
        <p>List all profiles with optional filtering.</p>
      </div>

      <div className={styles.docSection}>
        <h4>Get Single Profile</h4>
        <code className={styles.endpointCode}>GET /api/profiles/:businessId/:userId</code>
        <p>Get a specific profile by business ID and user ID.</p>
      </div>

      <div className={styles.docSection}>
        <h4>Search Profiles</h4>
        <code className={styles.endpointCode}>GET /api/profiles/search?q=query</code>
        <p>Full-text search across all profile fields.</p>
      </div>
    </div>
  )

  return (
    <div className={styles.apiIntegration}>
      <div className={styles.apiHeader}>
        <h2 className={styles.apiTitle}>
          <Code size={24} />
          API Integration
        </h2>
        <div className={styles.apiTabs}>
          <button
            className={`${styles.apiTab} ${activeTab === 'query' ? styles.active : ''}`}
            onClick={() => setActiveTab('query')}
          >
            <Search size={16} />
            Query Builder
          </button>
          <button
            className={`${styles.apiTab} ${activeTab === 'docs' ? styles.active : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <Code size={16} />
            Documentation
          </button>
        </div>
      </div>

      <div className={styles.apiContent}>
        {activeTab === 'query' ? (
          <>
            {renderQueryBuilder()}
            {renderResults()}
          </>
        ) : (
          renderDocumentation()
        )}
      </div>
    </div>
  )
}