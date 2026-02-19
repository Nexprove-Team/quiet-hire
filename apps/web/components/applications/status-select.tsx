'use client'

import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import { cn } from '@hackhyre/ui/lib/utils'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import { useUpdateApplicationStatus } from '@/hooks/use-recruiter-applications'
import type { ApplicationStatus } from '@/actions/recruiter-applications'

const STATUSES = Object.entries(APPLICATION_STATUS_CONFIG) as [
  ApplicationStatus,
  (typeof APPLICATION_STATUS_CONFIG)[string],
][]

export function ApplicationStatusSelect({
  applicationId,
  currentStatus,
}: {
  applicationId: string
  currentStatus: string
}) {
  const { mutate, isPending } = useUpdateApplicationStatus()

  function handleChange(value: string) {
    if (value === currentStatus) return
    mutate(
      { applicationId, status: value as ApplicationStatus },
      {
        onSuccess: () => {
          const config = APPLICATION_STATUS_CONFIG[value]
          toast.success(`Status updated to ${config?.label ?? value}`)
        },
        onError: (error) => {
          toast.error('Failed to update status', {
            description:
              error instanceof Error ? error.message : 'Something went wrong',
          })
        },
      }
    )
  }

  const config = APPLICATION_STATUS_CONFIG[currentStatus]

  return (
    <Select value={currentStatus} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger
        className={cn(
          'h-auto w-auto gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
          config?.className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        {STATUSES.map(([status, cfg]) => (
          <SelectItem key={status} value={status} className="text-[12px]">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  status === 'not_reviewed' && 'bg-muted-foreground',
                  status === 'under_review' && 'bg-foreground',
                  status === 'interviewing' && 'bg-blue-500',
                  status === 'rejected' && 'bg-red-500',
                  status === 'hired' && 'bg-emerald-500'
                )}
              />
              {cfg.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
