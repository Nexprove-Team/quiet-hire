'use client'
import { ReactNode } from 'react'
import { cn } from '@hackhyre/ui/lib/utils'
import { usePathname } from 'next/navigation'

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
  const path = usePathname()
  return (
    <div
      className={cn(
        'flex min-h-svh flex-col transition-colors duration-300 ease-in-out',
        path.includes('/jobs-listing') ? 'bg-white' : 'bg-background'
      )}
    >
      {children}
    </div>
  )
}

export default LayoutWrapper
