'use client'
import { cn } from '@hackhyre/ui/lib/utils'
import { usePathname } from 'next/navigation'
import React from 'react'

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname()

  return (
    <div
      className={cn(
        'min-h-svh transition-colors duration-300 ease-in-out',
        path.includes('/jobs-listing') ? 'bg-white' : 'bg-background'
      )}
    >
      {children}
    </div>
  )
}

export default LayoutWrapper
