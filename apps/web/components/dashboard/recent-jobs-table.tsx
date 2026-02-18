'use client'

import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@hackhyre/ui/components/table'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Location, ArrowRight, Briefcase } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { JOB_STATUS_CONFIG } from '@/lib/constants'

interface RecentJob {
  id: string
  title: string
  status: string
  applicationCount: number
  location: string | null
  createdAt: Date
}

interface RecentJobsTableProps {
  jobs: RecentJob[]
}

export function RecentJobsTable({ jobs }: RecentJobsTableProps) {
  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Briefcase
              size={32}
              variant="Linear"
              className="text-muted-foreground/30 mb-2"
            />
            <p className="text-muted-foreground text-[13px]">
              No jobs posted yet
            </p>
            <p className="text-muted-foreground/60 mt-1 text-[12px]">
              Create your first job listing to start receiving applications
            </p>
            <Button size="sm" className="mt-4" asChild>
              <Link href="/recuriter/jobs/create">Post a Job</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Recent Jobs</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          asChild
        >
          <Link href="/recuriter/jobs">
            View All
            <ArrowRight size={14} variant="Linear" className="ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Apps</TableHead>
              <TableHead className="hidden sm:table-cell">Location</TableHead>
              <TableHead className="hidden md:table-cell">Posted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => {
              const config = JOB_STATUS_CONFIG[job.status]
              return (
                <TableRow key={job.id} className="cursor-pointer">
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={config?.variant as 'default'}
                      className={cn('text-[11px]', config?.className)}
                    >
                      {config?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {job.applicationCount}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {job.location && (
                      <span className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Location size={12} variant="Bold" />
                        {job.location}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                    {new Date(job.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
