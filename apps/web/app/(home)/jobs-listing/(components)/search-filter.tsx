'use client'

import { useEffect, useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@hackhyre/ui/components/select'
import { Slider } from '@hackhyre/ui/components/slider'
import { Button } from '@hackhyre/ui/components/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@hackhyre/ui/components/popover'
import {
  Briefcase,
  DollarCircle,
  Filter,
  Location,
  SearchNormal,
  CloseCircle,
} from '@hackhyre/ui/icons'
import { useJobListingFilter } from './use-job-listing-filter'

// Default values to compare against
const DEFAULTS = {
  q: '',
  role: '',
  location: 'any',
  experience: '',
  period: 'monthly',
  salary: [0, 20000],
  schedule: ['Full time', 'Part time'],
  employment: ['Full day', 'Flexible schedule', 'Distant work'],
  recruiter: '',
}

export const PERIOD_CONFIG: Record<string, { max: number; step: number }> = {
  hourly: { max: 500, step: 5 },
  monthly: { max: 50000, step: 100 },
  yearly: { max: 500000, step: 5000 },
}

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return true
  const sorted1 = [...a].sort()
  const sorted2 = [...b].sort()
  return sorted1.some((v, i) => v !== sorted2[i])
}

/* ── Shared select styling ─────────────────────────────────── */
const triggerCls =
  'h-auto w-full border-0 p-0 text-sm font-medium text-white shadow-none ring-0 focus:ring-0 focus-visible:ring-0'
const contentCls = 'border-neutral-800 bg-neutral-900'
const itemCls = 'text-neutral-300 focus:bg-neutral-800 focus:text-white'

/* ── Individual filter controls (shared between mobile & desktop) */

function LocationFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Location
        size={18}
        variant="Linear"
        className="shrink-0 text-neutral-500"
      />
      <Select value={value || 'any'} onValueChange={onChange}>
        <SelectTrigger className={triggerCls}>
          <SelectValue placeholder="Work location" />
        </SelectTrigger>
        <SelectContent className={contentCls}>
          <SelectItem value="any" className={itemCls}>
            Work location
          </SelectItem>
          <SelectItem value="remote" className={itemCls}>
            Remote
          </SelectItem>
          <SelectItem value="onsite" className={itemCls}>
            On-site
          </SelectItem>
          <SelectItem value="hybrid" className={itemCls}>
            Hybrid
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function ExperienceFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <Briefcase
        size={18}
        variant="Linear"
        className="shrink-0 text-neutral-500"
      />
      <Select value={value || 'any'} onValueChange={onChange}>
        <SelectTrigger className={triggerCls}>
          <SelectValue placeholder="Experience" />
        </SelectTrigger>
        <SelectContent className={contentCls}>
          <SelectItem value="any" className={itemCls}>
            Experience
          </SelectItem>
          <SelectItem value="entry" className={itemCls}>
            Entry level
          </SelectItem>
          <SelectItem value="mid" className={itemCls}>
            Mid level
          </SelectItem>
          <SelectItem value="senior" className={itemCls}>
            Senior level
          </SelectItem>
          <SelectItem value="lead" className={itemCls}>
            Lead
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function PeriodFilter({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <DollarCircle
        size={18}
        variant="Linear"
        className="shrink-0 text-neutral-500"
      />
      <Select value={value || 'monthly'} onValueChange={onChange}>
        <SelectTrigger className={triggerCls}>
          <SelectValue placeholder="Per month" />
        </SelectTrigger>
        <SelectContent className={contentCls}>
          <SelectItem value="monthly" className={itemCls}>
            Per month
          </SelectItem>
          <SelectItem value="hourly" className={itemCls}>
            Per hour
          </SelectItem>
          <SelectItem value="yearly" className={itemCls}>
            Per year
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

function SalaryFilter({
  salary,
  period,
  onChange,
}: {
  salary: number[]
  period: string
  onChange: (v: number[]) => void
}) {
  const config = PERIOD_CONFIG[period] ?? PERIOD_CONFIG.monthly!
  const [local, setLocal] = useState(salary)

  const s0 = salary[0] ?? 0
  const s1 = salary[1] ?? config.max
  useEffect(() => {
    setLocal([s0, s1])
  }, [s0, s1])

  return (
    <div className="flex items-center gap-3">
      <div className="shrink-0">
        <p className="text-[11px] font-medium text-neutral-500">Salary range</p>
        <p className="text-sm font-semibold text-white">
          ${local[0]?.toLocaleString()} – ${local[1]?.toLocaleString()}
        </p>
      </div>
      <Slider
        value={local}
        min={0}
        max={config.max}
        step={config.step}
        onValueChange={setLocal}
        onValueCommit={onChange}
        className="w-full min-w-24"
      />
    </div>
  )
}

const SearchFilter = () => {
  const [filters, setFilters] = useJobListingFilter()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const periodConfig = PERIOD_CONFIG[filters.period] ?? PERIOD_CONFIG.monthly!

  const handlePeriodChange = (v: string) => {
    const config = PERIOD_CONFIG[v] ?? PERIOD_CONFIG.monthly!
    setFilters({ period: v, salary: [0, config.max] })
  }

  const hasActiveFilters =
    filters.q !== DEFAULTS.q ||
    (filters.location !== '' && filters.location !== DEFAULTS.location) ||
    filters.experience !== DEFAULTS.experience ||
    filters.period !== DEFAULTS.period ||
    filters.salary[0] !== 0 ||
    filters.salary[1] !== periodConfig.max ||
    filters.recruiter !== DEFAULTS.recruiter ||
    arraysEqual(filters.schedule, DEFAULTS.schedule) ||
    arraysEqual(filters.employment, DEFAULTS.employment)

  const activeFilterCount = [
    filters.location !== '' && filters.location !== 'any',
    filters.experience !== '' && filters.experience !== 'any',
    filters.period !== 'monthly',
    filters.salary[0] !== 0 || filters.salary[1] !== periodConfig.max,
  ].filter(Boolean).length

  const resetAll = () =>
    setFilters({
      q: '',
      role: '',
      location: 'any',
      experience: '',
      period: 'monthly',
      salary: [0, 50000],
      schedule: ['Full time', 'Part time'],
      employment: ['Full day', 'Flexible schedule', 'Distant work'],
      recruiter: '',
    })

  return (
    <div className="bg-black p-4 dark:bg-black">
      <div className="mx-auto max-w-375">
        {/* ── Mobile: search + filter button ─────────────── */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2">
            <SearchNormal
              size={18}
              variant="Linear"
              className="shrink-0 text-neutral-500"
            />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
              placeholder="Search jobs..."
              className="h-auto w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-neutral-500"
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              onClick={resetAll}
            >
              <CloseCircle size={16} variant="Linear" />
            </Button>
          )}

          <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative shrink-0 gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <Filter size={16} variant="Linear" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="bg-primary flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-neutral-900">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-[calc(100vw-2rem)] max-w-sm space-y-4 border-neutral-800 bg-neutral-900 p-4"
            >
              <LocationFilter
                value={filters.location}
                onChange={(v) => setFilters({ location: v })}
              />
              <ExperienceFilter
                value={filters.experience}
                onChange={(v) => setFilters({ experience: v })}
              />
              <PeriodFilter
                value={filters.period}
                onChange={handlePeriodChange}
              />
              <SalaryFilter
                salary={filters.salary}
                period={filters.period}
                onChange={(v) => setFilters({ salary: v })}
              />
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto w-full gap-1.5 px-2 py-1.5 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  onClick={() => {
                    resetAll()
                    setFiltersOpen(false)
                  }}
                >
                  <CloseCircle size={14} variant="Linear" />
                  Reset all filters
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>

        {/* ── Desktop: inline horizontal bar ─────────────── */}
        <div className="hidden md:flex md:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-2 px-4 py-2">
            <SearchNormal
              size={18}
              variant="Linear"
              className="shrink-0 text-neutral-500"
            />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value })}
              placeholder="Search jobs..."
              className="h-auto w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-neutral-500"
            />
          </div>

          <div className="border-l border-neutral-800 px-4 py-2">
            <LocationFilter
              value={filters.location}
              onChange={(v) => setFilters({ location: v })}
            />
          </div>

          <div className="border-l border-neutral-800 px-4 py-2">
            <ExperienceFilter
              value={filters.experience}
              onChange={(v) => setFilters({ experience: v })}
            />
          </div>

          <div className="border-l border-neutral-800 px-4 py-2">
            <PeriodFilter
              value={filters.period}
              onChange={handlePeriodChange}
            />
          </div>

          <div className="ml-auto border-l border-neutral-800 px-4 py-2">
            <SalaryFilter
              salary={filters.salary}
              period={filters.period}
              onChange={(v) => setFilters({ salary: v })}
            />
          </div>

          {hasActiveFilters && (
            <div className="border-l border-neutral-800 px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto gap-1.5 px-2 py-1 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white"
                onClick={resetAll}
              >
                <CloseCircle size={14} variant="Linear" />
                Reset
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchFilter
