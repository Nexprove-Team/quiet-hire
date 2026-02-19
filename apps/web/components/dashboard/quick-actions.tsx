'use client'

import Link from 'next/link'
import { Button } from '@hackhyre/ui/components/button'
import { AddCircle, People } from '@hackhyre/ui/icons'

export function QuickActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href="/recuriter/candidates">
          <People size={16} variant="Linear" className="mr-1.5" />
          Candidates
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/recuriter/jobs/create">
          <AddCircle size={16} variant="Bold" className="mr-1.5" />
          Create Job
        </Link>
      </Button>
    </div>
  )
}
