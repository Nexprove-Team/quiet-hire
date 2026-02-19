'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@hackhyre/ui/components/alert-dialog'
import { Spinner } from '@hackhyre/ui/components/spinner'
import { useDeleteJob } from '@/hooks/use-jobs'

interface DeleteJobDialogProps {
  jobId: string
  jobTitle: string
  redirectAfterDelete?: boolean
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DeleteJobDialog({
  jobId,
  jobTitle,
  redirectAfterDelete,
  trigger,
  open,
  onOpenChange,
}: DeleteJobDialogProps) {
  const router = useRouter()
  const { mutate, isPending } = useDeleteJob()

  function handleDelete() {
    mutate(jobId, {
      onSuccess: () => {
        toast.success('Job deleted', {
          description: `"${jobTitle}" has been deleted.`,
        })
        onOpenChange?.(false)
        if (redirectAfterDelete) {
          router.push('/recuriter/jobs')
        }
      },
      onError: (error) => {
        toast.error('Failed to delete job', {
          description:
            error instanceof Error ? error.message : 'Something went wrong',
        })
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete job?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove &ldquo;{jobTitle}&rdquo; and hide it
            from your listings. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
