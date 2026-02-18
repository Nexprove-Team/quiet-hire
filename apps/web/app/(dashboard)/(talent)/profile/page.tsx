'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import {
  User,
  Edit,
  Briefcase,
  Location,
  LinkIcon,
  Code,
  Global,
  DocumentText,
  Add,
  CloseCircle,
} from '@hackhyre/ui/icons'
import { XIcon } from '@hackhyre/ui/icons'
import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Badge } from '@hackhyre/ui/components/badge'
import { Slider } from '@hackhyre/ui/components/slider'
import { Switch } from '@hackhyre/ui/components/switch'
import { Label } from '@hackhyre/ui/components/label'
import { Skeleton } from '@hackhyre/ui/components/skeleton'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@hackhyre/ui/components/card'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@hackhyre/ui/components/avatar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@hackhyre/ui/components/form'

import { useProfile, useUpdateProfile } from '@/hooks/use-profile'
import type { CandidateProfileData } from '@/actions/profile'

// ── Schema ────────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  isOpenToWork: z.boolean(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  portfolioUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  resumeUrl: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>
      <Skeleton className="h-40 rounded-xl" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
      <Skeleton className="h-44 rounded-xl" />
    </div>
  )
}

// ── Empty State ───────────────────────────────────────────────────────────────

function ProfileEmptyState({ onEdit }: { onEdit: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <User size={28} variant="Linear" className="text-primary" />
        </div>
        <h3 className="font-mono text-lg font-semibold">
          Complete your profile
        </h3>
        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          Add your skills, experience, and links so recruiters can find you and
          understand what you bring to the table.
        </p>
        <Button onClick={onEdit} className="mt-6">
          <Edit size={16} variant="Linear" className="mr-2" />
          Set up profile
        </Button>
      </CardContent>
    </Card>
  )
}

// ── View Mode ─────────────────────────────────────────────────────────────────

function ProfileView({
  profile,
  onEdit,
}: {
  profile: CandidateProfileData
  onEdit: () => void
}) {
  const links = [
    {
      label: 'LinkedIn',
      url: profile.linkedinUrl,
      icon: <LinkIcon size={16} variant="Linear" className="text-muted-foreground shrink-0" />,
    },
    {
      label: 'GitHub',
      url: profile.githubUrl,
      icon: <Code size={16} variant="Linear" className="text-muted-foreground shrink-0" />,
    },
    {
      label: 'Portfolio',
      url: profile.portfolioUrl,
      icon: <Global size={16} variant="Linear" className="text-muted-foreground shrink-0" />,
    },
    {
      label: 'Twitter',
      url: profile.twitterUrl,
      icon: <span className="text-muted-foreground shrink-0"><XIcon size={16} color="currentColor" /></span>,
    },
    {
      label: 'Resume',
      url: profile.resumeUrl,
      icon: <DocumentText size={16} variant="Linear" className="text-muted-foreground shrink-0" />,
    },
  ].filter((l) => l.url)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card>
        <CardContent className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center">
          <Avatar className="h-20 w-20 shrink-0">
            {profile.image && <AvatarImage src={profile.image} alt={profile.name} />}
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-mono text-xl font-bold tracking-tight">
                  {profile.name}
                </h2>
                <p className="text-muted-foreground text-sm">{profile.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="shrink-0"
              >
                <Edit size={14} variant="Linear" className="mr-1.5" />
                Edit
              </Button>
            </div>
            {profile.headline && (
              <p className="mt-2 text-[15px] font-medium">{profile.headline}</p>
            )}
            {profile.isOpenToWork && (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 mt-2">
                Open to Work
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* About */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {profile.bio || 'No bio yet.'}
            </p>
            {profile.location && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Location size={16} variant="Linear" />
                {profile.location}
              </div>
            )}
            {profile.experienceYears !== null && (
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <Briefcase size={16} variant="Linear" />
                {profile.experienceYears === 20
                  ? '20+'
                  : profile.experienceYears}{' '}
                {profile.experienceYears === 1 ? 'year' : 'years'} of experience
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No skills added.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Links */}
      {links.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {links.map((link) => (
              <div
                key={link.label}
                className="flex items-center gap-3 text-sm"
              >
                {link.icon}
                <span className="text-muted-foreground w-20 shrink-0">
                  {link.label}
                </span>
                <a
                  href={link.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary truncate text-sm hover:underline"
                >
                  {link.url}
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── Edit Mode ─────────────────────────────────────────────────────────────────

function ProfileEdit({
  profile,
  onCancel,
}: {
  profile: CandidateProfileData | null
  onCancel: () => void
}) {
  const updateProfile = useUpdateProfile()
  const [skills, setSkills] = useState<string[]>(profile?.skills ?? [])
  const [skillInput, setSkillInput] = useState('')
  const [experienceYears, setExperienceYears] = useState(
    profile?.experienceYears ?? 2
  )

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      headline: profile?.headline ?? '',
      bio: profile?.bio ?? '',
      location: profile?.location ?? '',
      isOpenToWork: profile?.isOpenToWork ?? true,
      linkedinUrl: profile?.linkedinUrl ?? '',
      githubUrl: profile?.githubUrl ?? '',
      portfolioUrl: profile?.portfolioUrl ?? '',
      twitterUrl: profile?.twitterUrl ?? '',
      resumeUrl: profile?.resumeUrl ?? '',
    },
  })

  function addSkill() {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed])
      setSkillInput('')
    }
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill))
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addSkill()
    }
  }

  async function onSubmit(values: ProfileFormValues) {
    try {
      await updateProfile.mutateAsync({
        ...values,
        skills,
        experienceYears,
      })
      toast.success('Profile updated successfully')
      onCancel()
    } catch {
      toast.error('Failed to update profile')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Hero section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="headline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Headline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Full-Stack Developer | React & Node.js"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isOpenToWork"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <FormLabel className="text-sm font-medium">
                      Open to Work
                    </FormLabel>
                    <p className="text-muted-foreground text-xs">
                      Let recruiters know you&apos;re available
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* About section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell recruiters about yourself, your experience, and what you're looking for..."
                      className="min-h-28 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. San Francisco, CA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Years of Experience</Label>
                <span className="text-primary text-sm font-semibold">
                  {experienceYears === 20 ? '20+' : experienceYears}{' '}
                  {experienceYears === 1 ? 'year' : 'years'}
                </span>
              </div>
              <Slider
                value={[experienceYears]}
                onValueChange={([val]) =>
                  val !== undefined && setExperienceYears(val)
                }
                min={0}
                max={20}
                step={1}
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a skill and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addSkill}
              >
                <Add size={18} variant="Linear" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:text-destructive ml-1 transition-colors"
                    >
                      <CloseCircle size={14} variant="Linear" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Links section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <LinkIcon size={14} variant="Bulk" />
                    LinkedIn
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/yourprofile"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="githubUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Code size={14} variant="Bulk" />
                    GitHub
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/yourusername"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="portfolioUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Global size={14} variant="Bulk" />
                    Portfolio
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://yourportfolio.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="twitterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <XIcon size={14} />
                    Twitter / X
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://x.com/yourhandle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resumeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <DocumentText size={14} variant="Bulk" />
                    Resume URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://drive.google.com/your-resume"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) return <ProfileSkeleton />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-2xl font-bold tracking-tight">
          Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          {isEditing
            ? 'Update your candidate profile.'
            : 'View and edit your candidate profile.'}
        </p>
      </div>

      {isEditing ? (
        <ProfileEdit
          profile={profile ?? null}
          onCancel={() => setIsEditing(false)}
        />
      ) : profile ? (
        <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
      ) : (
        <ProfileEmptyState onEdit={() => setIsEditing(true)} />
      )}
    </div>
  )
}
