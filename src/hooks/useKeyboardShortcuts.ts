import { useEffect } from 'react'

interface KeyboardShortcuts {
  [key: string]: () => void
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcuts) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Build the key combination string
      const keys = []
      if (event.metaKey || event.ctrlKey) keys.push('cmd')
      if (event.shiftKey) keys.push('shift')
      if (event.altKey) keys.push('alt')
      keys.push(event.key.toLowerCase())
      
      const combination = keys.join('+')
      
      // Check if we have a handler for this combination
      if (shortcuts[combination]) {
        event.preventDefault()
        shortcuts[combination]()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts])
}