'use client'

import { Button } from '@hackhyre/ui/components/button'
import { Badge } from '@hackhyre/ui/components/badge'
import { Separator } from '@hackhyre/ui/components/separator'
import { TickCircle, Warning, DocumentText } from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import type { RelevanceSummary } from './types'

interface RelevanceSummaryResultProps {
  summary: RelevanceSummary
  onChangeResume: () => void
}

function getMatchColor(pct: number) {
  if (pct >= 75) return 'bg-emerald-100 text-emerald-700 border-emerald-200'
  if (pct >= 50) return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-rose-100 text-rose-700 border-rose-200'
}

export function RelevanceSummaryResult({
  summary,
  onChangeResume,
}: RelevanceSummaryResultProps) {
  return (
    <div className="space-y-4">
      {/* Match percentage */}
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={cn(
            'px-3 py-1.5 text-lg font-bold',
            getMatchColor(summary.matchPercentage)
          )}
        >
          {summary.matchPercentage}%
        </Badge>
        <span className="text-[13px] font-medium text-neutral-700">
          Match Score
        </span>
      </div>

      {/* Strengths */}
      {summary.strengths.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
            Strengths
          </p>
          <ul className="space-y-1.5">
            {summary.strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[13px] text-neutral-700"
              >
                <TickCircle
                  size={14}
                  variant="Bold"
                  className="mt-0.5 shrink-0 text-emerald-500"
                />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gaps */}
      {summary.gaps.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
            Gaps
          </p>
          <ul className="space-y-1.5">
            {summary.gaps.map((g, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[13px] text-neutral-700"
              >
                <Warning
                  size={14}
                  variant="Bold"
                  className="mt-0.5 shrink-0 text-amber-500"
                />
                {g}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Separator className="bg-neutral-200" />

      <div className="rounded-lg bg-neutral-50 p-3">
        <p className="text-[13px] leading-relaxed text-neutral-600">
          {summary.recommendation}
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-2 border-neutral-200 bg-white text-[13px] font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
        onClick={onChangeResume}
      >
        <DocumentText size={14} variant="Linear" />
        Change Resume
      </Button>
    </div>
  )
}
