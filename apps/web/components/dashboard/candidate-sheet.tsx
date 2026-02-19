'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@hackhyre/ui/components/avatar'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Separator } from '@hackhyre/ui/components/separator'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@hackhyre/ui/components/tabs'
import {
  Sms,
  Location,
  Calendar,
  Briefcase,
  LinkIcon,
  DocumentText,
  Star,
  ArrowLeft,
  ArrowRight,
  Send,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { useCandidateSheet } from '@/hooks/use-candidate-sheet'
import { useRecruiterCandidateDetail } from '@/hooks/use-recruiter-candidates'
import { useScheduleInterviewSheet } from '@/components/dashboard/schedule-interview-sheet'
import { useComposeEmailSheet } from '@/components/dashboard/compose-email-sheet'
import { APPLICATION_STATUS_CONFIG } from '@/lib/constants'
import type {
  RecruiterCandidateDetail,
  CandidateApplication,
} from '@/actions/recruiter-candidates'

// ── Info Item ────────────────────────────────────────────────────────

function InfoItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Sms
  label: string
  value: string
  href?: string
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon
        size={14}
        variant="Linear"
        className="text-muted-foreground shrink-0"
      />
      <span className="text-muted-foreground w-24 shrink-0 text-[12px]">
        {label}
      </span>
      <span className="min-w-0 truncate text-[12px] font-medium">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </span>
    </div>
  )
}

// ── CV Tab ───────────────────────────────────────────────────────────

function CvTab({ candidate }: { candidate: RecruiterCandidateDetail }) {
  return (
    <div className="space-y-5 pt-4">
      {/* Bio */}
      {candidate.bio && (
        <>
          <div>
            <h4 className="text-muted-foreground mb-2 text-[12px] font-semibold tracking-wider uppercase">
              About
            </h4>
            <p className="text-muted-foreground text-[12px] leading-relaxed">
              {candidate.bio}
            </p>
          </div>
          <Separator />
        </>
      )}

      {/* Skills */}
      {candidate.skills.length > 0 && (
        <>
          <div>
            <h4 className="text-muted-foreground mb-2 text-[12px] font-semibold tracking-wider uppercase">
              Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-2 py-0.5 text-[11px] font-medium"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Social Links */}
      {(candidate.linkedinUrl ||
        candidate.githubUrl ||
        candidate.twitterUrl ||
        candidate.portfolioUrl) && (
        <>
          <div>
            <h4 className="text-muted-foreground mb-2 text-[12px] font-semibold tracking-wider uppercase">
              Links
            </h4>
            <div className="space-y-1">
              {candidate.linkedinUrl && (
                <InfoItem
                  icon={LinkIcon}
                  label="LinkedIn"
                  value={candidate.linkedinUrl}
                  href={candidate.linkedinUrl}
                />
              )}
              {candidate.githubUrl && (
                <InfoItem
                  icon={LinkIcon}
                  label="GitHub"
                  value={candidate.githubUrl}
                  href={candidate.githubUrl}
                />
              )}
              {candidate.twitterUrl && (
                <InfoItem
                  icon={LinkIcon}
                  label="Twitter"
                  value={candidate.twitterUrl}
                  href={candidate.twitterUrl}
                />
              )}
              {candidate.portfolioUrl && (
                <InfoItem
                  icon={LinkIcon}
                  label="Portfolio"
                  value={candidate.portfolioUrl}
                  href={candidate.portfolioUrl}
                />
              )}
            </div>
          </div>
          <Separator />
        </>
      )}

      {/* Resume */}
      <div>
        <h4 className="text-muted-foreground mb-2 text-[12px] font-semibold tracking-wider uppercase">
          Resume
        </h4>
        {candidate.resumeUrl ? (
          <div className="space-y-2">
            <div className="overflow-hidden rounded-lg border">
              <iframe
                src={`https://docs.google.com/gview?url=${encodeURIComponent(candidate.resumeUrl)}&embedded=true`}
                className="h-[400px] w-full"
                title="Resume"
              />
            </div>
            <a
              href={candidate.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex items-center gap-1 text-[11px] hover:underline"
            >
              <DocumentText size={12} variant="Linear" />
              Open Resume
            </a>
          </div>
        ) : (
          <p className="text-muted-foreground/60 text-[12px]">
            No resume uploaded
          </p>
        )}
      </div>
    </div>
  )
}

// ── Applied Jobs Tab ────────────────────────────────────────────────

function AppliedJobsTab({
  applications,
}: {
  applications: CandidateApplication[]
}) {
  return (
    <div className="space-y-3 pt-4">
      {applications.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-[12px]">
          No applications found
        </p>
      ) : (
        applications.map((app) => {
          const config = APPLICATION_STATUS_CONFIG[app.status]
          return (
            <div key={app.id} className="space-y-2 rounded-xl border p-3">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold">{app.jobTitle}</p>
                <Badge
                  variant={config?.variant as 'default'}
                  className={cn('text-[10px] font-medium', config?.className)}
                >
                  {config?.label}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar size={11} variant="Linear" />
                  {new Date(app.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {app.relevanceScore !== null && (
                  <span className="flex items-center gap-1">
                    <Star size={11} variant="Bold" className="text-amber-500" />
                    {Math.round(app.relevanceScore * 100)}% match
                  </span>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// ── Sheet ────────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[480px] sm:max-w-[480px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border'

function CandidateSheetSkeleton() {
  return (
    <div className="space-y-4 px-6 py-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Separator />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export function CandidateSheet() {
  const {
    isOpen,
    candidateId,
    candidateIds,
    close,
    navigateNext,
    navigatePrev,
  } = useCandidateSheet()
  const [activeTab, setActiveTab] = useState('cv')
  const openCompose = useComposeEmailSheet((s) => s.open)
  const openSchedule = useScheduleInterviewSheet((s) => s.open)

  const { data: candidate, isLoading } = useRecruiterCandidateDetail(
    candidateId ?? ''
  )

  const currentIndex = candidateId ? candidateIds.indexOf(candidateId) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < candidateIds.length - 1
  const showNav = candidateIds.length > 1

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        className={SHEET_CLASSES}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">Candidate Detail</SheetTitle>

        {/* Top nav bar */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-0">
          <h3 className="text-[13px] font-semibold">Candidate Detail</h3>
          <div className="flex items-center gap-1">
            {showNav && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  disabled={!hasPrev}
                  onClick={navigatePrev}
                >
                  <ArrowLeft size={14} variant="Linear" />
                </Button>
                <span className="text-muted-foreground min-w-[4ch] text-center text-[11px] tabular-nums">
                  {String(currentIndex + 1).padStart(2, '0')} of{' '}
                  {String(candidateIds.length).padStart(2, '0')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg"
                  disabled={!hasNext}
                  onClick={navigateNext}
                >
                  <ArrowRight size={14} variant="Linear" />
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="ml-1 h-7 w-7 rounded-lg"
              onClick={close}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && <CandidateSheetSkeleton />}

        {/* Empty state */}
        {!isLoading && !candidate && (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground text-[13px]">
              Candidate not found
            </p>
          </div>
        )}

        {/* Content */}
        {!isLoading && candidate && (
          <>
            {/* Header */}
            <div className="shrink-0 border-b px-6 pt-3 pb-5">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  {candidate.image && (
                    <AvatarImage src={candidate.image} alt={candidate.name} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
                    {candidate.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-[16px] font-bold">
                      {candidate.name}
                    </h2>
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-[12px]">
                    {candidate.headline ?? 'Applicant'}
                  </p>
                  {candidate.linkedinUrl && (
                    <a
                      href={candidate.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary mt-1 flex items-center gap-1 text-[11px] hover:underline"
                    >
                      <LinkIcon size={11} variant="Linear" />
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-2 rounded-lg text-[12px]"
                  onClick={() =>
                    openCompose({
                      to: candidate.email,
                      candidateName: candidate.name,
                    })
                  }
                >
                  <Send size={14} variant="Bold" />
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 rounded-lg text-[12px]"
                  onClick={() =>
                    openSchedule({
                      candidateName: candidate.name,
                      candidateEmail: candidate.email,
                    })
                  }
                >
                  <Calendar size={14} variant="Linear" />
                  Schedule
                </Button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                {/* Personal Info */}
                <div className="space-y-0.5">
                  <h3 className="text-muted-foreground mb-2 text-[12px] font-semibold tracking-wider uppercase">
                    Personal Information
                  </h3>
                  <InfoItem
                    icon={Sms}
                    label="Email"
                    value={candidate.email}
                    href={`mailto:${candidate.email}`}
                  />
                  {candidate.location && (
                    <InfoItem
                      icon={Location}
                      label="Location"
                      value={candidate.location}
                    />
                  )}
                  <InfoItem
                    icon={Briefcase}
                    label="Experience"
                    value={
                      candidate.experienceYears
                        ? `${candidate.experienceYears} Years`
                        : '—'
                    }
                  />
                </div>

                <Separator className="my-4" />

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="cv" className="flex-1 text-[12px]">
                      <DocumentText
                        size={13}
                        variant="Linear"
                        className="mr-1"
                      />
                      CV
                    </TabsTrigger>
                    <TabsTrigger value="applied" className="flex-1 text-[12px]">
                      <Briefcase
                        size={13}
                        variant="Linear"
                        className="mr-1"
                      />
                      Applied Jobs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="cv">
                    <CvTab candidate={candidate} />
                  </TabsContent>
                  <TabsContent value="applied">
                    <AppliedJobsTab applications={candidate.applications} />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
