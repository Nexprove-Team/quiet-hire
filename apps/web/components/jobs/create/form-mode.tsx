'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { useCreateJob } from '@/hooks/use-jobs'
import type { CreateJobInput } from '@/actions/job-mutations'

import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Switch } from '@hackhyre/ui/components/switch'
import { Label } from '@hackhyre/ui/components/label'
import { Spinner } from '@hackhyre/ui/components/spinner'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@hackhyre/ui/components/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hackhyre/ui/components/form'
import {
  Briefcase,
  Location,
  DollarCircle,
  DocumentText,
} from '@hackhyre/ui/icons'

import { TagInput } from './tag-input'
import { SalaryRangeInput } from './salary-range-input'
import { JobPreview } from './job-preview'

const schema = z.object({
  title: z.string().min(1, 'Job title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  employmentType: z.string(),
  experienceLevel: z.string(),
  location: z.string().optional(),
  isRemote: z.boolean(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryCurrency: z.string(),
  requirements: z.array(z.string()),
  responsibilities: z.array(z.string()),
  skills: z.array(z.string()),
})

type FormValues = z.infer<typeof schema>

export function FormMode() {
  const router = useRouter()
  const { mutateAsync, isPending: isSubmitting } = useCreateJob()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      employmentType: 'full_time',
      experienceLevel: 'mid',
      location: '',
      isRemote: false,
      salaryMin: undefined,
      salaryMax: undefined,
      salaryCurrency: 'USD',
      requirements: [],
      responsibilities: [],
      skills: [],
    },
  })

  const watchedValues = form.watch()

  async function onSubmit(values: FormValues, asDraft = false) {
    try {
      await mutateAsync({
        ...values,
        employmentType:
          values.employmentType as CreateJobInput['employmentType'],
        experienceLevel:
          values.experienceLevel as CreateJobInput['experienceLevel'],
        status: asDraft ? 'draft' : 'open',
      })
      toast.success(asDraft ? 'Draft saved!' : 'Job published!', {
        description: `"${values.title}" has been ${asDraft ? 'saved as a draft' : 'published'}.`,
      })
      router.push('/recuriter/jobs')
    } catch (error) {
      toast.error('Failed to create job', {
        description:
          error instanceof Error ? error.message : 'Something went wrong',
      })
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Form */}
      <div className="lg:col-span-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((v) => onSubmit(v, false))}
            className="space-y-5"
          >
            {/* Basic Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Briefcase
                    size={16}
                    variant="Bulk"
                    className="text-primary"
                  />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Senior Frontend Engineer"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role, responsibilities, and what you're looking for..."
                          rows={5}
                          {...field}
                          className="h-37.5 resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="full_time">Full-time</SelectItem>
                            <SelectItem value="part_time">Part-time</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="internship">
                              Internship
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="entry">Entry</SelectItem>
                            <SelectItem value="mid">Mid</SelectItem>
                            <SelectItem value="senior">Senior</SelectItem>
                            <SelectItem value="lead">Lead</SelectItem>
                            <SelectItem value="executive">Executive</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Location size={16} variant="Bulk" className="text-primary" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Location</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center justify-between">
                  <Label>Remote friendly</Label>
                  <Switch
                    checked={form.watch('isRemote')}
                    onCheckedChange={(checked) =>
                      form.setValue('isRemote', checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Compensation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <DollarCircle
                    size={16}
                    variant="Bulk"
                    className="text-primary"
                  />
                  Compensation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SalaryRangeInput
                  minValue={form.watch('salaryMin')}
                  maxValue={form.watch('salaryMax')}
                  onMinChange={(v) => form.setValue('salaryMin', v)}
                  onMaxChange={(v) => form.setValue('salaryMax', v)}
                />
              </CardContent>
            </Card>

            {/* Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <DocumentText
                    size={16}
                    variant="Bulk"
                    className="text-primary"
                  />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Requirements</Label>
                  <TagInput
                    value={form.watch('requirements')}
                    onChange={(tags) => form.setValue('requirements', tags)}
                    placeholder="Add a requirement and press Enter..."
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Responsibilities</Label>
                  <TagInput
                    value={form.watch('responsibilities')}
                    onChange={(tags) => form.setValue('responsibilities', tags)}
                    placeholder="Add a responsibility and press Enter..."
                  />
                </div>
                <div>
                  <Label className="mb-2 block">Skills</Label>
                  <TagInput
                    value={form.watch('skills')}
                    onChange={(tags) => form.setValue('skills', tags)}
                    placeholder="Add a skill and press Enter..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => form.handleSubmit((v) => onSubmit(v, true))()}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
                Create Job
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Preview */}
      <div className="lg:col-span-2">
        <JobPreview data={watchedValues} />
      </div>
    </div>
  )
}
