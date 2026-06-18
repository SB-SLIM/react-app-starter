'use client'

import { useEffect, useRef } from 'react'

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}

export function Reveal({ children, delay = 0, className, style }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    el.style.opacity = '0'
    el.style.transform = 'translateY(18px)'
    el.style.transition = `opacity 0.6s ${delay}ms var(--ease-out, cubic-bezier(0.22,1,0.36,1)), transform 0.6s ${delay}ms var(--ease-out, cubic-bezier(0.22,1,0.36,1))`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translateY(0)'
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
