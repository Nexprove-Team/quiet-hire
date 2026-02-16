'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { Global, Gallery, DocumentText } from '@hackhyre/ui/icons'

import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Textarea } from '@hackhyre/ui/components/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hackhyre/ui/components/form'
import type { StepProps } from '../onboarding-wizard'

const schema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyWebsite: z.string().optional(),
  companyLogoUrl: z.string().optional(),
  companyDescription: z.string().optional(),
})

type Values = z.infer<typeof schema>

export function RecruiterStepCompany({
  user,
  data,
  onUpdate,
  onNext,
}: StepProps) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: data.companyName ?? '',
      companyWebsite: data.companyWebsite ?? '',
      companyLogoUrl: data.companyLogoUrl ?? '',
      companyDescription: data.companyDescription ?? '',
    },
  })

  function onSubmit(values: Values) {
    onUpdate(values)
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="font-mono text-2xl font-bold tracking-tight">
          Tell us about your company
        </h2>
        <p className="text-muted-foreground text-sm">
          Help candidates learn about your organization,{' '}
          {user.name.split(' ')[0]}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Inc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Global size={14} variant="Bulk" />
                  Website
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://acme.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyLogoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Gallery size={14} variant="Bulk" />
                  Logo URL
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://acme.com/logo.png" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <DocumentText size={14} variant="Bulk" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="What does your company do? What's your mission?"
                    rows={3}
                    {...field}
                    className="h-37.5 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
