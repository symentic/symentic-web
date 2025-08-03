import React, { useState } from 'react'
import { Search, Loader2, Sparkles } from 'lucide-react'
import { ProfileGrid } from './ProfileGrid'
import { ProfileDetail } from './ProfileDetail'
import { ExistingEngramProfileService } from '../../services/existingEngramProfileService'
import styles from '../../styles/dashboard/SourceSearch.module.css'

interface MatchedProfile {
  profile: any
  reasoning: string
}

const loadingMessages = ['Sourcing', 'Consulting', 'Collecting', 'Generating']

export const SourceSearch: React.FC = () => {
  const [prompt, setPrompt] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [matchedProfiles, setMatchedProfiles] = useState<MatchedProfile[]>([])
  const [selectedEngram, setSelectedEngram] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  const searchProfiles = async () => {
    if (!prompt.trim()) return

    setIsSearching(true)
    setError(null)
    setMatchedProfiles([])
    setLoadingMessageIndex(0)

    // Start loading message rotation
    const messageInterval = setInterval(() => {
      setLoadingMessageIndex(prev => (prev + 1) % loadingMessages.length)
    }, 1500)

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.')
      }

      let allProfiles
      try {
        allProfiles = await ExistingEngramProfileService.listAllProfiles()
        if (!allProfiles || allProfiles.length === 0) {
          throw new Error('No profiles found in database')
        }
      } catch (dbError) {
        console.error('Database error:', dbError)
        throw new Error('Unable to connect to profile database. Please check your AWS configuration and internet connection.')
      }
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Find relevant profiles matching the user's query. Return JSON with "matches" array containing objects with "name" and "reasoning" fields. Maximum 5 matches.

              Format: {"matches": [{"name": "John Doe", "reasoning": "Brief explanation why they match"}]}`
            },
            {
              role: 'user',
              content: `Query: "${prompt}"
              
              Profiles:
              ${JSON.stringify(allProfiles.map(p => ({
                name: p.name,
                role: p.role,
                skills: p.skills,
                tags: p.tags,
                bio: p.bio,
                interests: p.interests
              })), null, 2)}`
            }
          ],
          temperature: 0.3,
          response_format: { type: "json_object" }
        })
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API request failed: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      const responseContent = data.choices[0].message.content
      
      let parsedResponse
      try {
        parsedResponse = JSON.parse(responseContent)
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', responseContent)
        throw new Error('Invalid response format from AI service')
      }

      // Handle different response formats
      let matches = []
      if (Array.isArray(parsedResponse)) {
        matches = parsedResponse
      } else if (parsedResponse.matches && Array.isArray(parsedResponse.matches)) {
        matches = parsedResponse.matches
      } else {
        console.error('Unexpected response format:', parsedResponse)
        throw new Error('Unexpected response format from AI service')
      }

      const profileMatches: MatchedProfile[] = []
      for (const match of matches) {
        if (match && match.name && match.reasoning) {
          const profile = allProfiles.find(p => p.name === match.name)
          if (profile) {
            profileMatches.push({
              profile,
              reasoning: match.reasoning
            })
          }
        }
      }

      setMatchedProfiles(profileMatches)
    } catch (err) {
      console.error('Search error:', err)
      setError('Failed to search profiles. Please try again.')
    } finally {
      clearInterval(messageInterval)
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      searchProfiles()
    }
  }

  return (
    <div className={styles.sourceSearch}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <Sparkles className={styles.titleIcon} />
            Source profiles
          </h1>
          <p className={styles.subtitle}>
            Find clients or employees with one prompt
          </p>
        </div>
      </div>

      <div className={styles.searchSection}>
        <div className={styles.searchBox}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='Try "Find me engineers who work with ML" or "People interested in blockchain"'
            className={styles.searchInput}
            disabled={isSearching}
          />
          <button
            onClick={searchProfiles}
            disabled={isSearching || !prompt.trim()}
            className={styles.searchButton}
          >
            {isSearching ? (
              <>
                <span className={styles.loadingText}>
                  {loadingMessages[loadingMessageIndex]}
                  <span className={styles.dots}>...</span>
                </span>
              </>
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      {matchedProfiles.length > 0 && (
        <div className={styles.results}>
          <h2 className={styles.resultsTitle}>
            Found {matchedProfiles.length} matching profile{matchedProfiles.length !== 1 ? 's' : ''}
          </h2>
          
          <div className={styles.matchedProfiles}>
            {matchedProfiles.map((match, index) => (
              <div key={index} className={styles.matchedProfile}>
                <div 
                  className={styles.profileCard}
                  onClick={() => setSelectedEngram(match.profile)}
                >
                  <ProfileGrid 
                    engrams={[match.profile]}
                    selectedEngram={selectedEngram}
                    onSelectEngram={setSelectedEngram}
                  />
                </div>
                <div className={styles.reasoning}>
                  <p>{match.reasoning}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {matchedProfiles.length === 0 && !isSearching && !error && (
        <div className={styles.emptyState}>
          <Sparkles size={48} className={styles.emptyIcon} />
          <h3>Start Your Search</h3>
          <p>Enter a natural language query to find profiles that match your criteria</p>
        </div>
      )}

      {selectedEngram && (
        <ProfileDetail 
          engram={selectedEngram}
          onClose={() => setSelectedEngram(null)}
        />
      )}
    </div>
  )
}