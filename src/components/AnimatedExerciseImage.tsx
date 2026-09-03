import { useEffect, useState } from 'react'

interface Props {
  images: string[]
  active: boolean
  className?: string
}

const FRAME_MS = 650

export default function AnimatedExerciseImage({ images, active, className }: Props) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!active || images.length < 2) {
      setFrame(0)
      return
    }
    const id = setInterval(() => setFrame((f) => (f + 1) % images.length), FRAME_MS)
    return () => clearInterval(id)
  }, [active, images.length])

  if (images.length === 0) {
    return (
      <span className={`ex-thumb-fallback ${className ?? ''}`} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 7v10M18 7v10M2 10v4M22 10v4M6 12h12" />
        </svg>
      </span>
    )
  }

  return <img className={className} src={images[frame]} alt="" loading="lazy" />
}
