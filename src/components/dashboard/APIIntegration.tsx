import React, { useState } from 'react'
import { Code, Search, Copy, CheckCircle } from 'lucide-react'
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
  const [apiKey, setApiKey] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.symentic.dev/api'

  const handleQuery = async () => {
    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      let url = `${API_BASE_URL}/profiles`
      const params = new URLSearchParams()

      // Add query parameters based on selection
      if (queryType === 'name' && nameQuery) {
        url += '/search'
        params.append('q', nameQuery)
      } else if (queryType === 'tags' && tagsQuery) {
        url += '/query'
        const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
        tags.forEach(tag => params.append('tags', tag))
      } else if (queryType === 'both' && (nameQuery || tagsQuery)) {
        url += '/query'
        if (nameQuery) params.append('name', nameQuery)
        if (tagsQuery) {
          const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
          tags.forEach(tag => params.append('tags', tag))
        }
      }

      // Add business ID filter if provided
      if (businessId) params.append('businessId', businessId)

      // Add pagination parameters
      params.append('limit', '50')

      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url
      
      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }

      // Add API key if provided
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`
      }

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`API Error (${response.status}): ${errorData}`)
      }
      
      const data = await response.json()
      setResults(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred while fetching data')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getEndpointUrl = () => {
    let url = `${API_BASE_URL}/profiles`
    const params = new URLSearchParams()

    // Determine endpoint based on query type
    if (queryType === 'name' && nameQuery) {
      url += '/search'
      params.append('q', nameQuery)
    } else if (queryType === 'tags' && tagsQuery) {
      url += '/query'
      const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
      tags.forEach(tag => params.append('tags', tag))
    } else if (queryType === 'both' && (nameQuery || tagsQuery)) {
      url += '/query'
      if (nameQuery) params.append('name', nameQuery)
      if (tagsQuery) {
        const tags = tagsQuery.split(',').map(t => t.trim()).filter(t => t)
        tags.forEach(tag => params.append('tags', tag))
      }
    }

    // Add business ID filter if provided
    if (businessId) params.append('businessId', businessId)
    
    // Add pagination
    params.append('limit', '50')

    return params.toString() ? `${url}?${params.toString()}` : url
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

      <div className={styles.inputGroup}>
        <label>API Key (optional):</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key for authenticated requests"
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
      <p className={styles.apiBaseUrl}>Base URL: <code>{API_BASE_URL}</code></p>
      
      <div className={styles.docSection}>
        <h4>List All Profiles</h4>
        <code className={styles.endpointCode}>GET /profiles</code>
        <p>Retrieve all profiles with optional pagination.</p>
        
        <h5>Query Parameters:</h5>
        <ul className={styles.paramsList}>
          <li><strong>limit</strong> (number): Maximum number of results (default: 50, max: 100)</li>
          <li><strong>lastKey</strong> (string): Pagination token for next page</li>
          <li><strong>businessId</strong> (string): Filter by specific business ID</li>
        </ul>

        <h5>Example:</h5>
        <code className={styles.exampleCode}>
          GET {API_BASE_URL}/profiles?limit=20&businessId=T096L62N0MB
        </code>
      </div>

      <div className={styles.docSection}>
        <h4>Query Profiles</h4>
        <code className={styles.endpointCode}>GET /profiles/query</code>
        <p>Query profiles by name and/or tags with advanced filtering.</p>
        
        <h5>Query Parameters:</h5>
        <ul className={styles.paramsList}>
          <li><strong>name</strong> (string): Search by name, email, or role</li>
          <li><strong>tags</strong> (array): Filter by tags (can be repeated)</li>
          <li><strong>businessId</strong> (string): Filter by business ID</li>
          <li><strong>userType</strong> (string): Filter by user type (internal/external)</li>
          <li><strong>limit</strong> (number): Results per page (default: 50)</li>
          <li><strong>lastKey</strong> (string): Pagination token</li>
        </ul>

        <h5>Example:</h5>
        <code className={styles.exampleCode}>
          GET {API_BASE_URL}/profiles/query?name=john&tags=developer&tags=senior&limit=25
        </code>
      </div>

      <div className={styles.docSection}>
        <h4>Search Profiles</h4>
        <code className={styles.endpointCode}>GET /profiles/search</code>
        <p>Full-text search across all profile fields (name, email, role, description).</p>
        
        <h5>Query Parameters:</h5>
        <ul className={styles.paramsList}>
          <li><strong>q</strong> (string): Search query</li>
          <li><strong>businessId</strong> (string): Filter by business ID</li>
          <li><strong>limit</strong> (number): Results per page (default: 50)</li>
        </ul>

        <h5>Example:</h5>
        <code className={styles.exampleCode}>
          GET {API_BASE_URL}/profiles/search?q=frontend developer
        </code>
      </div>

      <div className={styles.docSection}>
        <h4>Get Single Profile</h4>
        <code className={styles.endpointCode}>GET /profiles/:businessId/:userId</code>
        <p>Get a specific profile by business ID and user ID.</p>

        <h5>Example:</h5>
        <code className={styles.exampleCode}>
          GET {API_BASE_URL}/profiles/T096L62N0MB/U123456789
        </code>
      </div>

      <div className={styles.docSection}>
        <h4>Authentication</h4>
        <p>All API requests require proper authentication headers. Include your API key or bearer token in the Authorization header:</p>
        <code className={styles.exampleCode}>
          Authorization: Bearer your-api-token
        </code>
      </div>

      <div className={styles.docSection}>
        <h4>Response Format</h4>
        <p>All successful responses return JSON with the following structure:</p>
        <pre className={styles.jsonExample}>
{`{
  "success": true,
  "data": [...], // Array of profiles or single profile
  "count": 25,   // Number of results
  "pagination": {
    "hasMore": true,
    "lastKey": "eyJ..."
  }
}`}
        </pre>
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