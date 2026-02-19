'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import { Avatar, AvatarFallback } from '@hackhyre/ui/components/avatar'
import { Badge } from '@hackhyre/ui/components/badge'
import { Progress } from '@hackhyre/ui/components/progress'
import { Button } from '@hackhyre/ui/components/button'
import { ArrowRight } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { DocumentText } from '@hackhyre/ui/icons'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { useCandidateSheet } from '@/hooks/use-candidate-sheet'

interface RecentApplication {
  id: string
  candidateName: string
  candidateEmail: string
  candidateId: string | null
  jobTitle: string
  status: string
  relevanceScore: number | null
  createdAt: Date
}

interface RecentApplicationsListProps {
  applications: RecentApplication[]
}

export function RecentApplicationsList({
  applications,
}: RecentApplicationsListProps) {
  const openCandidate = useCandidateSheet((s) => s.open)
  const applicationIds = applications.map((a) => a.id)

  if (applications.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">
            Recent Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DocumentText
              size={32}
              variant="Linear"
              className="text-muted-foreground/30 mb-2"
            />
            <p className="text-muted-foreground text-[13px]">
              No applications yet
            </p>
            <p className="text-muted-foreground/60 mt-1 text-[12px]">
              Applications will show up here once candidates start applying
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">
          Recent Applications
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          asChild
        >
          <Link href="/recuriter/applications">
            View All
            <ArrowRight size={14} variant="Linear" className="ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-1 px-3">
        {applications.map((app) => {
          const config = APPLICATION_STATUS_CONFIG[app.status]
          const initials = app.candidateName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()

          return (
            <button
              key={app.id}
              onClick={() =>
                openCandidate(app.id, applicationIds)
              }
              className="hover:bg-accent/50 flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 text-left transition-colors"
            >
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className="bg-muted text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">
                    {app.candidateName}
                  </p>
                  <span className="text-muted-foreground shrink-0 text-[11px]">
                    {formatDistanceToNow(new Date(app.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-muted-foreground truncate text-xs">
                  {app.jobTitle}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge
                    variant={config?.variant as 'default'}
                    className={cn('px-1.5 py-0 text-[10px]', config?.className)}
                  >
                    {config?.label}
                  </Badge>
                  {app.relevanceScore !== null && (
                    <div className="flex flex-1 items-center gap-1.5">
                      <Progress
                        value={app.relevanceScore * 100}
                        className="h-1.5"
                      />
                      <span className="text-muted-foreground text-[10px] font-medium">
                        {Math.round(app.relevanceScore * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}
