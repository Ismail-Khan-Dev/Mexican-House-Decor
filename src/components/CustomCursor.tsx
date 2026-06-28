import { useRef, useEffect } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    const handleMouseOver = (e: MouseEvent) => {
      const targetEl = e.target as HTMLElement
      if (
        targetEl.closest('a') ||
        targetEl.closest('button') ||
        targetEl.closest('[data-cursor-hover]')
      ) {
        if (cursorRef.current) {
          cursorRef.current.style.width = '40px'
          cursorRef.current.style.height = '40px'
          cursorRef.current.style.backgroundColor = 'transparent'
          cursorRef.current.style.border = '2px solid #C75C2E'
        }
      } else {
        if (cursorRef.current) {
          cursorRef.current.style.width = '12px'
          cursorRef.current.style.height = '12px'
          cursorRef.current.style.backgroundColor = '#C75C2E'
          cursorRef.current.style.border = 'none'
        }
      }
    }

    let rafId: number
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15
      pos.current.y += (target.current.y - pos.current.y) * 0.15

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${pos.current.x - (cursorRef.current.offsetWidth / 2)}px, ${pos.current.y - (cursorRef.current.offsetHeight / 2)}px)`
      }
      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#C75C2E',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        transition: 'width 0.3s, height 0.3s, background-color 0.3s, border 0.3s',
        willChange: 'transform',
      }}
    />
  )
}
