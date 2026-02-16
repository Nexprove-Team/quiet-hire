'use client'

import { useState } from 'react'
import { motion } from 'motion/react'

import { Button } from '@hackhyre/ui/components/button'
import { Input } from '@hackhyre/ui/components/input'
import { Textarea } from '@hackhyre/ui/components/textarea'
import { Switch } from '@hackhyre/ui/components/switch'
import { Label } from '@hackhyre/ui/components/label'
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
import { Spinner } from '@hackhyre/ui/components/spinner'
import { Edit, TickCircle, ArrowLeft } from '@hackhyre/ui/icons'

import { TagInput } from './tag-input'
import { SalaryRangeInput } from './salary-range-input'
import type { MOCK_AI_PARSED_JOB } from '@/lib/mock-data'

type ParsedJob = typeof MOCK_AI_PARSED_JOB

interface AiParseResultProps {
  data: ParsedJob
  onBack: () => void
  onCreateJob: (data: ParsedJob, asDraft: boolean) => Promise<void>
  isCreating?: boolean
}

export function AiParseResult({ data, onBack, onCreateJob, isCreating }: AiParseResultProps) {
  const [editData, setEditData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)

  function update<K extends keyof ParsedJob>(key: K, value: ParsedJob[K]) {
    setEditData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={18} variant="Linear" />
          </Button>
          <div>
            <h3 className="font-mono text-lg font-bold">
              AI Analysis Complete
            </h3>
            <p className="text-muted-foreground text-sm">
              Review and edit the extracted job details
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit size={14} variant="Linear" className="mr-1.5" />
          {isEditing ? 'Done Editing' : 'Edit Fields'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Title & Description */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs">Title</Label>
              {isEditing ? (
                <Input
                  value={editData.title}
                  onChange={(e) => update('title', e.target.value)}
                />
              ) : (
                <p className="font-medium">{editData.title}</p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Description</Label>
              {isEditing ? (
                <Textarea
                  value={editData.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                />
              ) : (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {editData.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Type & Level */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs">Employment Type</Label>
              {isEditing ? (
                <Select
                  value={editData.employmentType}
                  onValueChange={(v) =>
                    update('employmentType', v as ParsedJob['employmentType'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full-time</SelectItem>
                    <SelectItem value="part_time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm capitalize">
                  {editData.employmentType.replace('_', ' ')}
                </p>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Experience Level</Label>
              {isEditing ? (
                <Select
                  value={editData.experienceLevel}
                  onValueChange={(v) =>
                    update('experienceLevel', v as ParsedJob['experienceLevel'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry</SelectItem>
                    <SelectItem value="mid">Mid</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm capitalize">{editData.experienceLevel}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location & Salary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Location & Compensation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs">Location</Label>
              {isEditing ? (
                <Input
                  value={editData.location}
                  onChange={(e) => update('location', e.target.value)}
                />
              ) : (
                <p className="text-sm">{editData.location}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Remote</Label>
              <Switch
                checked={editData.isRemote}
                onCheckedChange={(v) => update('isRemote', v)}
                disabled={!isEditing}
              />
            </div>
            {isEditing ? (
              <SalaryRangeInput
                minValue={editData.salaryMin}
                maxValue={editData.salaryMax}
                onMinChange={(v) => update('salaryMin', v ?? 0)}
                onMaxChange={(v) => update('salaryMax', v ?? 0)}
              />
            ) : (
              <div>
                <Label className="mb-1.5 block text-xs">Salary Range</Label>
                <p className="text-sm">
                  ${editData.salaryMin?.toLocaleString()} – $
                  {editData.salaryMax?.toLocaleString()} / year
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Skills & Requirements */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Skills & Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-xs">Requirements</Label>
              {isEditing ? (
                <TagInput
                  value={editData.requirements}
                  onChange={(v) => update('requirements', v)}
                />
              ) : (
                <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-sm">
                  {editData.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Responsibilities</Label>
              {isEditing ? (
                <TagInput
                  value={editData.responsibilities}
                  onChange={(v) => update('responsibilities', v)}
                />
              ) : (
                <ul className="text-muted-foreground list-inside list-disc space-y-0.5 text-sm">
                  {editData.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <Label className="mb-1.5 block text-xs">Skills</Label>
              {isEditing ? (
                <TagInput
                  value={editData.skills}
                  onChange={(v) => update('skills', v)}
                />
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {editData.skills.map((s) => (
                    <span
                      key={s}
                      className="bg-secondary text-secondary-foreground rounded-md px-2 py-0.5 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onBack} disabled={isCreating}>
          Re-analyze
        </Button>
        <Button
          variant="outline"
          disabled={isCreating}
          onClick={() => onCreateJob(editData, true)}
        >
          Save as Draft
        </Button>
        <Button disabled={isCreating} onClick={() => onCreateJob(editData, false)}>
          {isCreating ? (
            <Spinner className="mr-1.5 h-4 w-4" />
          ) : (
            <TickCircle size={16} variant="Bold" className="mr-1.5" />
          )}
          {isCreating ? 'Creating...' : 'Create Job'}
        </Button>
      </div>
    </motion.div>
  )
}
