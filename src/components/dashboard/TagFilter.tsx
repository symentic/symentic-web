import React from 'react'
import { Tag, X } from 'lucide-react'

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
    <div className="tag-filter-container">
      <div className="tag-filter-header">
        <Tag size={16} />
        <span>Filter by tags:</span>
      </div>
      <button 
        className="clear-all-tags"
        onClick={() => onTagsChange([])}
        disabled={selectedTags.length === 0}
      >
        Clear all
      </button>
      <div className="tag-filter-list">
        {availableTags.map(tag => (
          <button
            key={tag}
            className={`tag-filter-chip ${selectedTags.includes(tag) ? 'active' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
            {selectedTags.includes(tag) && <X size={14} />}
          </button>
        ))}
      </div>
    </div>
  )
}