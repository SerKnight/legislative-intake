import { useEffect, useState } from 'react'

interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
}

export function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const normalizedX = (x / window.innerWidth) * 2 - 1
      const normalizedY = -(y / window.innerHeight) * 2 + 1

      setMousePosition({ x, y, normalizedX, normalizedY })
    }

    // Throttle updates for performance
    let rafId: number | null = null
    const throttledUpdate = (e: MouseEvent) => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          updateMousePosition(e)
          rafId = null
        })
      }
    }

    window.addEventListener('mousemove', throttledUpdate)
    
    // Touch support for mobile
    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const x = touch.clientX
        const y = touch.clientY
        const normalizedX = (x / window.innerWidth) * 2 - 1
        const normalizedY = -(y / window.innerHeight) * 2 + 1
        setMousePosition({ x, y, normalizedX, normalizedY })
      }
    }

    window.addEventListener('touchmove', handleTouch, { passive: true })

    return () => {
      window.removeEventListener('mousemove', throttledUpdate)
      window.removeEventListener('touchmove', handleTouch)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  return mousePosition
}

