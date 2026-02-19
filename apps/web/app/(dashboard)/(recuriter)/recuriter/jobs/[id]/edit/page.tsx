'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@hackhyre/ui/components/button'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import { ArrowLeft } from '@hackhyre/ui/icons'
import { useRecruiterJobDetail } from '@/hooks/use-recruiter-jobs'
import { FormMode } from '@/components/jobs/create/form-mode'

function EditJobSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-6 w-64" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-3">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export default function EditJobPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(props.params)
  const { data: job, isLoading, error } = useRecruiterJobDetail(id)

  if (isLoading) return <EditJobSkeleton />
  if (error || !job) notFound()

  const initialValues = {
    companyId: job.company?.id,
    title: job.title,
    description: job.description,
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel,
    location: job.location ?? '',
    isRemote: job.isRemote,
    salaryMin: job.salaryMin ?? undefined,
    salaryMax: job.salaryMax ?? undefined,
    salaryCurrency: job.salaryCurrency,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    skills: job.skills,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground w-fit gap-2"
          asChild
        >
          <Link href={`/recuriter/jobs/${id}`}>
            <ArrowLeft size={16} variant="Linear" />
            Back to Job
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-xl font-bold tracking-tight">Edit Job</h1>
        <p className="text-muted-foreground mt-0.5 text-[13px]">
          Update the details for &ldquo;{job.title}&rdquo;
        </p>
      </div>

      <FormMode mode="edit" jobId={id} initialValues={initialValues} />
    </div>
  )
}
