'use client'

import { useState, useTransition } from 'react'
import { motion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Label } from '@hackhyre/ui/components/label'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Switch } from '@hackhyre/ui/components/switch'
import { saveCandidateProfile } from '@/actions/onboarding'
import type { SaveCandidateProfileInput } from '@/actions/onboarding'

interface ParsedData {
  headline?: string
  bio?: string
  skills?: string[]
  experienceYears?: number
  location?: string
  linkedinUrl?: string
  githubUrl?: string
  portfolioUrl?: string
}

interface ResumeReviewFormProps {
  parsed: ParsedData
  resumeUrl: string
  onBack: () => void
}

export function ResumeReviewForm({
  parsed,
  resumeUrl,
  onBack,
}: ResumeReviewFormProps) {
  const [isPending, startTransition] = useTransition()
  const [headline, setHeadline] = useState(parsed.headline ?? '')
  const [bio, setBio] = useState(parsed.bio ?? '')
  const [skillsText, setSkillsText] = useState((parsed.skills ?? []).join(', '))
  const [experienceYears, setExperienceYears] = useState(
    parsed.experienceYears?.toString() ?? ''
  )
  const [location, setLocation] = useState(parsed.location ?? '')
  const [isOpenToWork, setIsOpenToWork] = useState(true)
  const [linkedinUrl, setLinkedinUrl] = useState(parsed.linkedinUrl ?? '')
  const [githubUrl, setGithubUrl] = useState(parsed.githubUrl ?? '')
  const [portfolioUrl, setPortfolioUrl] = useState(parsed.portfolioUrl ?? '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const input: SaveCandidateProfileInput = {
      headline: headline || undefined,
      bio: bio || undefined,
      skills: skillsText
        ? skillsText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
      experienceYears: experienceYears
        ? parseInt(experienceYears, 10)
        : undefined,
      location: location || undefined,
      isOpenToWork,
      linkedinUrl: linkedinUrl || undefined,
      githubUrl: githubUrl || undefined,
      portfolioUrl: portfolioUrl || undefined,
      resumeUrl,
    }

    startTransition(() => {
      saveCandidateProfile(input)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex h-full flex-col overflow-y-auto p-6 lg:p-10"
    >
      <div className="space-y-2 pb-6">
        <h2 className="font-mono text-2xl font-bold tracking-tight">
          Review your profile
        </h2>
        <p className="text-muted-foreground text-sm">
          We extracted this from your resume. Edit anything that needs fixing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="headline">Headline</Label>
          <Input
            id="headline"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="e.g. Senior React Developer"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Short professional summary"
            rows={3}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input
            id="skills"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
            placeholder="React, TypeScript, Node.js"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min={0}
              max={50}
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label htmlFor="openToWork" className="text-sm">
            Open to work
          </Label>
          <Switch
            id="openToWork"
            checked={isOpenToWork}
            onCheckedChange={setIsOpenToWork}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input
              id="portfolio"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isPending}
          >
            Back
          </Button>
          <Button type="submit" className="flex-1" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Profile'
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
