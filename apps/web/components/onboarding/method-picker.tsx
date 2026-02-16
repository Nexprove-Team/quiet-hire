'use client'

import { motion } from 'motion/react'
import { MagicStar, DocumentText, Edit, ArrowLeft } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import type { OnboardingMethod } from '@/actions/onboarding'

interface MethodPickerProps {
  onSelect: (method: OnboardingMethod) => void
}

const methods = [
  {
    id: 'ai-chat' as const,
    icon: MagicStar,
    title: 'Chat with Hyre',
    description: 'Our AI coach will guide you through a quick conversation',
  },
  {
    id: 'resume' as const,
    icon: DocumentText,
    title: 'Upload Resume',
    description: "We'll extract your info from a PDF or Word doc",
  },
  {
    id: 'manual' as const,
    icon: Edit,
    title: 'Fill in Manually',
    description: 'Complete a step-by-step form at your own pace',
  },
]

export function MethodPicker({ onSelect }: MethodPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col justify-center space-y-8 p-6 lg:p-10"
    >
      <div className="space-y-2">
        <h1 className="font-mono text-3xl font-bold tracking-tight">
          Set up your profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Choose how you&apos;d like to get started
        </p>
      </div>

      <div className="space-y-3">
        {methods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => onSelect(method.id)}
            className={cn(
              'border-border bg-card flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all duration-200',
              'hover:border-primary/40 hover:shadow-[0_0_24px_oklch(0.82_0.22_155/0.1)]'
            )}
          >
            <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
              <method.icon size={24} variant="Bulk" className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-sm font-semibold">{method.title}</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                {method.description}
              </p>
            </div>
            <ArrowLeft
              size={18}
              variant="Linear"
              className="text-muted-foreground ml-auto shrink-0 rotate-180"
            />
          </button>
        ))}
      </div>
    </motion.div>
  )
}
