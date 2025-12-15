import { useEffect, useState, useRef } from 'react'

interface MouseMovementState {
  isMoving: boolean
  lastMoveTime: number
}

export function useMouseMovement() {
  const [isMoving, setIsMoving] = useState(false)
  const lastMoveTimeRef = useRef(Date.now())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleMouseMove = () => {
      lastMoveTimeRef.current = Date.now()
      setIsMoving(true)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Set mouse as stationary after 150ms of no movement
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false)
      }, 150)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleMouseMove)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return isMoving
}

