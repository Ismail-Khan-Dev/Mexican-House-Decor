import React, { useState, useRef, useEffect, type ReactNode } from 'react'

type IntrinsicElements = keyof React.JSX.IntrinsicElements

interface BlurRevealProps {
  children: ReactNode
  className?: string
  as?: IntrinsicElements
  threshold?: number
  delay?: number
}

export function BlurReveal({
  children,
  className = '',
  as: Tag = 'div',
  threshold = 0.3,
  delay = 0,
}: BlurRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay * 1000)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, delay])

  const Component = Tag as any

  return (
    <Component
      ref={ref}
      className={`blur-reveal-container ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </Component>
  )
}

interface SplitTextProps {
  text: string
  className?: string
}

export function SplitText({ text, className = '' }: SplitTextProps) {
  const lines = text.split('\n')
  return (
    <div className={className}>
      {lines.map((line, index) => (
        <span
          key={index}
          className="reveal-line"
          style={{
            transitionDelay: `${index * 0.08}s`,
            display: 'inline-block',
          }}
        >
          {line}
          {index < lines.length - 1 && <br />}
        </span>
      ))}
    </div>
  )
}
