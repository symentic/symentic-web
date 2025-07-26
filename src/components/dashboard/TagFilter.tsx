import React from 'react'
import { Tag } from 'lucide-react'
import styles from '../../styles/dashboard/Dashboard.module.css'

interface TagFilterProps {
  availableTags: string[]
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
}

export const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTags,
  onTagsChange
}) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag))
    } else {
      onTagsChange([...selectedTags, tag])
    }
  }

  if (availableTags.length === 0) {
    return null
  }

  return (
    <div className={styles.tagFilter}>
      <div className={styles.tagFilterLabel}>
        <Tag size={14} />
        <span>Tags:</span>
      </div>
      <div className={styles.tagList}>
        {availableTags.map(tag => (
          <button
            key={tag}
            className={`${styles.tag} ${selectedTags.includes(tag) ? styles.active : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <button 
        className={styles.clearButton}
        onClick={() => onTagsChange([])}
        disabled={selectedTags.length === 0}
      >
        Clear all
      </button>
    </div>
  )
}