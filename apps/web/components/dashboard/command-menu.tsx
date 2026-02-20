'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@hackhyre/ui/components/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@hackhyre/ui/components/command'
import { Briefcase, Building, Loader2 } from 'lucide-react'
import { searchCommandMenu } from '@/actions/jobs'
import {
  CANDIDATE_NAV_ITEMS,
  CANDIDATE_BOTTOM_ITEMS,
} from '@/lib/candidate-constants'

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function SearchSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="bg-muted h-4 w-4 animate-pulse rounded" />
          <div className="flex-1 space-y-1.5">
            <div className="bg-muted h-3.5 w-3/4 animate-pulse rounded" />
            <div className="bg-muted h-3 w-1/2 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebounce(query.trim(), 300)

  const { data, isFetching } = useQuery({
    queryKey: ['command-search', debouncedQuery],
    queryFn: () => searchCommandMenu(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    placeholderData: (prev) => prev,
  })

  // Register Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenChange(!open)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onOpenChange])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const hasQuery = debouncedQuery.length > 0
  const hasResults =
    (data?.jobs?.length ?? 0) > 0 || (data?.companies?.length ?? 0) > 0
  const navItems = [...CANDIDATE_NAV_ITEMS, ...CANDIDATE_BOTTOM_ITEMS]

  function navigate(href: string) {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="sr-only">
        <DialogTitle>Search</DialogTitle>
        <DialogDescription>Search jobs, companies, and navigation</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0" showCloseButton={false}>
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          <CommandInput
            placeholder="Search jobs, companies..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList className="min-h-75">
            {/* Loading skeleton — first load with no previous data */}
            {hasQuery && isFetching && !data && <SearchSkeleton />}

            {/* Empty state — only after search completes */}
            {hasQuery && !isFetching && !hasResults && (
              <CommandEmpty>No results found.</CommandEmpty>
            )}

            {/* Search results */}
            {hasQuery && data?.jobs && data.jobs.length > 0 && (
              <CommandGroup heading="Jobs" className={isFetching ? 'opacity-60' : ''}>
                {data.jobs.map((job) => (
                  <CommandItem
                    key={job.id}
                    value={`job-${job.id}-${job.title}`}
                    onSelect={() => navigate(`/jobs-listing/${job.id}`)}
                  >
                    <Briefcase className="mr-2 size-4 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{job.title}</p>
                      {(job.company || job.location) && (
                        <p className="text-muted-foreground truncate text-xs">
                          {[job.company, job.location]
                            .filter(Boolean)
                            .join(' \u00b7 ')}
                        </p>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {hasQuery && data?.companies && data.companies.length > 0 && (
              <CommandGroup heading="Companies" className={isFetching ? 'opacity-60' : ''}>
                {data.companies.map((company) => (
                  <CommandItem
                    key={company.id}
                    value={`company-${company.id}-${company.name}`}
                  >
                    <Building className="mr-2 size-4 shrink-0" />
                    <span className="truncate text-sm">{company.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Inline refetch indicator when updating with previous results visible */}
            {hasQuery && isFetching && data && (
              <div className="flex items-center justify-center gap-2 py-2">
                <Loader2 className="text-muted-foreground size-3 animate-spin" />
                <span className="text-muted-foreground text-xs">Updating...</span>
              </div>
            )}

            {/* Static navigation when search is empty */}
            {!hasQuery && (
              <CommandGroup heading="Navigation">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <CommandItem
                      key={item.href}
                      value={`nav-${item.label}`}
                      onSelect={() => navigate(item.href)}
                      disabled={item.isDisabled}
                    >
                      <Icon size={16} variant="Linear" className="mr-2 shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
