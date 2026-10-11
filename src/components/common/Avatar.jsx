import { useState } from 'react'
import { getInitials } from '../../utils/userUtils'

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
  xl: 'h-28 w-28 text-3xl',
}

export default function Avatar({ name = '', photoURL, size = 'md', className = '' }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const showImage = photoURL && photoURL !== failedUrl

  if (showImage) {
    return (
      <img
        src={photoURL}
        alt={`${name || 'User'}'s profile picture`}
        referrerPolicy="no-referrer"
        onError={() => setFailedUrl(photoURL)}
        className={`shrink-0 rounded-full object-cover ${sizes[size]} ${className}`}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary ${sizes[size]} ${className}`}
    >
      {getInitials(name)}
    </span>
  )
}