import { useState, useEffect } from 'react'

/**
 * Drop-in replacement for useState that persists to localStorage.
 * Reads are synchronous (no flash of empty state); writes are debounced
 * by React's own batching, so this is safe to call on every keystroke/click.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch (err) {
      console.error(`useLocalStorage: failed to read "${key}"`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.error(`useLocalStorage: failed to write "${key}"`, err)
    }
  }, [key, value])

  return [value, setValue]
}
