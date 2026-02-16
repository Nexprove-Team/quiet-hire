'use client'

import Link from 'next/link'
import { Sheet, SheetContent, SheetTitle } from '@hackhyre/ui/components/sheet'
import { Badge } from '@hackhyre/ui/components/badge'
import { Button } from '@hackhyre/ui/components/button'
import { Separator } from '@hackhyre/ui/components/separator'
import {
  Location,
  Global,
  Building,
  Calendar,
  People,
  Briefcase,
  ArrowRight,
} from '@hackhyre/ui/icons'
import { cn } from '@hackhyre/ui/lib/utils'
import { useCompanySheet } from './use-company-sheet'
import { toDisplayJob } from './mock-data'
import { useCompanyJobs } from '@/hooks/use-jobs'

// ── Light mode CSS variable overrides ─────────────────────────────────

const LIGHT_VARS: React.CSSProperties = {
  '--background': 'oklch(0.985 0 0)',
  '--foreground': 'oklch(0.145 0.005 285)',
  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0.005 285)',
  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0.005 285)',
  '--secondary': 'oklch(0.955 0.003 260)',
  '--secondary-foreground': 'oklch(0.205 0.005 260)',
  '--muted': 'oklch(0.955 0.003 260)',
  '--muted-foreground': 'oklch(0.52 0.01 260)',
  '--accent': 'oklch(0.955 0.04 155)',
  '--accent-foreground': 'oklch(0.145 0.005 285)',
  '--border': 'oklch(0.92 0.005 260)',
  '--input': 'oklch(0.92 0.005 260)',
  colorScheme: 'light',
} as React.CSSProperties

// ── Mock company profiles ─────────────────────────────────────────────

interface CompanyProfile {
  name: string
  industry: string
  description: string
  founded: string
  employees: string
  headquarters: string
  website: string
  logoColor: string
  logoLetter: string
}

const MOCK_COMPANIES: Record<string, CompanyProfile> = {
  Amazon: {
    name: 'Amazon',
    industry: 'E-Commerce & Cloud',
    description:
      'Amazon is a multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence. As one of the most valuable companies globally, we are constantly innovating to deliver the best customer experience.',
    founded: '1994',
    employees: '1,500,000+',
    headquarters: 'Seattle, WA',
    website: 'amazon.com',
    logoColor: 'bg-black',
    logoLetter: 'a',
  },
  Google: {
    name: 'Google',
    industry: 'Technology & Search',
    description:
      "Google is a global technology leader specializing in search, online advertising, cloud computing, and software. Our mission is to organize the world's information and make it universally accessible and useful.",
    founded: '1998',
    employees: '180,000+',
    headquarters: 'Mountain View, CA',
    website: 'google.com',
    logoColor: 'bg-blue-500',
    logoLetter: 'G',
  },
  Dribbble: {
    name: 'Dribbble',
    industry: 'Design Community',
    description:
      'Dribbble is the leading platform for designers to share their work, find inspiration, and connect with the design community. We help millions of designers and agencies find creative talent.',
    founded: '2009',
    employees: '200+',
    headquarters: 'Remote',
    website: 'dribbble.com',
    logoColor: 'bg-pink-500',
    logoLetter: 'D',
  },
  Twitter: {
    name: 'Twitter',
    industry: 'Social Media',
    description:
      'Twitter is a social media platform enabling real-time communication through short-form messages. We connect people to their interests and communities through open, public conversation.',
    founded: '2006',
    employees: '5,500+',
    headquarters: 'San Francisco, CA',
    website: 'twitter.com',
    logoColor: 'bg-sky-500',
    logoLetter: 'T',
  },
  Airbnb: {
    name: 'Airbnb',
    industry: 'Travel & Hospitality',
    description:
      'Airbnb is a global marketplace connecting travelers with unique accommodations and experiences. We believe in creating a world where anyone can belong anywhere.',
    founded: '2008',
    employees: '6,900+',
    headquarters: 'San Francisco, CA',
    website: 'airbnb.com',
    logoColor: 'bg-rose-500',
    logoLetter: 'A',
  },
  Apple: {
    name: 'Apple',
    industry: 'Consumer Electronics',
    description:
      'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. Known for innovation and design excellence, we create products that empower creativity.',
    founded: '1976',
    employees: '164,000+',
    headquarters: 'Cupertino, CA',
    website: 'apple.com',
    logoColor: 'bg-zinc-800',
    logoLetter: '',
  },
  Spotify: {
    name: 'Spotify',
    industry: 'Music & Audio',
    description:
      "Spotify is the world's largest audio streaming platform, offering millions of songs, podcasts, and audiobooks. We are transforming how people discover and enjoy audio content.",
    founded: '2006',
    employees: '9,000+',
    headquarters: 'Stockholm, Sweden',
    website: 'spotify.com',
    logoColor: 'bg-green-600',
    logoLetter: 'S',
  },
  Meta: {
    name: 'Meta',
    industry: 'Social Technology',
    description:
      'Meta builds technologies that help people connect, find communities, and grow businesses. Our products include Facebook, Instagram, WhatsApp, and cutting-edge virtual reality experiences.',
    founded: '2004',
    employees: '67,000+',
    headquarters: 'Menlo Park, CA',
    website: 'meta.com',
    logoColor: 'bg-blue-600',
    logoLetter: 'M',
  },
  Netflix: {
    name: 'Netflix',
    industry: 'Entertainment & Streaming',
    description:
      "Netflix is the world's leading streaming entertainment service with over 230 million paid memberships. We offer a wide variety of TV series, documentaries, feature films, and games across genres.",
    founded: '1997',
    employees: '13,000+',
    headquarters: 'Los Gatos, CA',
    website: 'netflix.com',
    logoColor: 'bg-red-600',
    logoLetter: 'N',
  },
  Stripe: {
    name: 'Stripe',
    industry: 'Financial Technology',
    description:
      'Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size use our software to accept payments and manage their operations online.',
    founded: '2010',
    employees: '8,000+',
    headquarters: 'San Francisco, CA',
    website: 'stripe.com',
    logoColor: 'bg-indigo-600',
    logoLetter: 'S',
  },
  Figma: {
    name: 'Figma',
    industry: 'Design Tools',
    description:
      'Figma is a collaborative design tool that enables teams to design, prototype, and gather feedback in a single platform. We are redefining how teams create together.',
    founded: '2012',
    employees: '1,500+',
    headquarters: 'San Francisco, CA',
    website: 'figma.com',
    logoColor: 'bg-violet-600',
    logoLetter: 'F',
  },
  Slack: {
    name: 'Slack',
    industry: 'Workplace Communication',
    description:
      'Slack is a messaging platform for business that connects people with the information they need. We bring teams together, wherever they are, to do their best work.',
    founded: '2009',
    employees: '3,500+',
    headquarters: 'San Francisco, CA',
    website: 'slack.com',
    logoColor: 'bg-purple-700',
    logoLetter: 'S',
  },
  Adobe: {
    name: 'Adobe',
    industry: 'Creative Software',
    description:
      'Adobe is a global leader in digital media and marketing solutions. Our creative, document, and experience cloud solutions transform how people and businesses create, manage, and engage.',
    founded: '1982',
    employees: '29,000+',
    headquarters: 'San Jose, CA',
    website: 'adobe.com',
    logoColor: 'bg-red-700',
    logoLetter: 'A',
  },
  Shopify: {
    name: 'Shopify',
    industry: 'E-Commerce',
    description:
      'Shopify provides a commerce platform for businesses of all sizes. Our technology powers millions of merchants worldwide, making it easy to start, grow, market, and manage a retail business.',
    founded: '2006',
    employees: '11,000+',
    headquarters: 'Ottawa, Canada',
    website: 'shopify.com',
    logoColor: 'bg-lime-700',
    logoLetter: 'S',
  },
  Uber: {
    name: 'Uber',
    industry: 'Transportation & Delivery',
    description:
      'Uber is a technology platform connecting riders, drivers, merchants, and delivery people. We are reimagining the way the world moves for the better.',
    founded: '2009',
    employees: '32,000+',
    headquarters: 'San Francisco, CA',
    website: 'uber.com',
    logoColor: 'bg-black',
    logoLetter: 'U',
  },
}

// ── Apple Logo SVG ────────────────────────────────────────────────────

function AppleLogo({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.2)}
      viewBox="0 0 14 17"
      fill="currentColor"
      className="text-white"
    >
      <path d="M13.2 12.8c-.3.7-.7 1.3-1.1 1.8-.6.8-1.1 1.3-1.5 1.6-.6.5-1.3.7-2 .7-.5 0-1.1-.1-1.8-.4-.7-.3-1.3-.4-1.8-.4s-1.1.1-1.8.4c-.7.3-1.2.4-1.7.4-.7 0-1.4-.3-2-.8C.9 15.5.4 14.8 0 13.8c-.1-.4.1-.7.4-.9.3-.1.7 0 .8.3.3.8.7 1.4 1.2 1.8.4.3.8.5 1.2.5.3 0 .8-.1 1.4-.4.6-.3 1.2-.4 1.7-.4.5 0 1 .1 1.7.4.6.3 1.1.4 1.4.4.4 0 .9-.2 1.3-.5.4-.4.8-.9 1.1-1.6.2-.4.4-.9.5-1.3.1-.3-.1-.6-.3-.8-.8-.4-1.4-.9-1.8-1.6-.5-.7-.7-1.5-.7-2.4 0-1 .3-1.9.9-2.6.5-.5 1-.9 1.7-1.2.2-.1.5 0 .7.2.1.2.1.5-.1.6-.5.2-.9.5-1.3.9-.4.5-.6 1.2-.6 1.9 0 .8.2 1.4.6 2 .4.6.9 1 1.5 1.3.2.1.3.4.3.6 0 .1 0 .2-.1.3-.2.5-.3 1-.6 1.5z" />
      <path d="M10.1 0c.1.7-.2 1.5-.7 2.2-.6.8-1.3 1.3-2.1 1.2-.1-.7.2-1.4.7-2.1C8.6.5 9.3.1 10.1 0z" />
    </svg>
  )
}

// ── Info Row ──────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Location
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <Icon size={14} variant="Linear" className="shrink-0 text-neutral-400" />
      <span className="w-24 shrink-0 text-[12px] text-neutral-500">
        {label}
      </span>
      <span className="text-[12px] font-medium text-neutral-900">{value}</span>
    </div>
  )
}

// ── Sheet ─────────────────────────────────────────────────────────────

const SHEET_CLASSES =
  'w-full sm:w-[480px] sm:max-w-[480px] p-0 flex flex-col inset-0 sm:inset-y-3 sm:right-3 sm:left-auto h-dvh sm:h-[calc(100dvh-1.5rem)] rounded-none sm:rounded-2xl border-0 sm:border bg-white text-neutral-900'

export function CompanySheet() {
  const { isOpen, companyName, close } = useCompanySheet()

  const { data: rawJobs } = useCompanyJobs(companyName ?? '')
  const companyJobs = (rawJobs ?? []).map((item, i) => toDisplayJob(item, i))
  const company = companyName ? MOCK_COMPANIES[companyName] : null

  if (!company) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
        <SheetContent
          side="right"
          className={SHEET_CLASSES}
          style={LIGHT_VARS}
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Company Profile</SheetTitle>
          <div className="flex h-full items-center justify-center">
            <p className="text-[13px] text-neutral-500">Company not found</p>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        className={SHEET_CLASSES}
        style={LIGHT_VARS}
        showCloseButton={false}
      >
        <SheetTitle className="sr-only">
          {company.name} Company Profile
        </SheetTitle>

        {/* Top bar */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-0">
          <h3 className="text-[13px] font-semibold text-neutral-900">
            Company Profile
          </h3>
          <button
            onClick={close}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
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
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-neutral-200 px-6 pt-4 pb-5">
            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-white',
                  company.logoColor
                )}
              >
                {company.name === 'Apple' ? (
                  <AppleLogo size={20} />
                ) : (
                  <span className="text-xl font-bold">
                    {company.logoLetter}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-bold text-neutral-900">
                  {company.name}
                </h2>
                <Badge
                  variant="outline"
                  className="mt-1 border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600"
                >
                  {company.industry}
                </Badge>
                <div className="mt-2 flex items-center gap-1.5 text-[12px] text-neutral-500">
                  <Location size={12} variant="Linear" />
                  {company.headquarters}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 flex-1 gap-2 rounded-lg text-[12px] font-semibold text-neutral-900"
              >
                <Global size={14} variant="Linear" />
                Visit Website
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 rounded-lg border-neutral-200 bg-white text-[12px] text-neutral-700 hover:bg-neutral-50"
              >
                <People size={14} variant="Linear" />
                Follow
              </Button>
            </div>
          </div>

          <div className="space-y-0 px-6 py-5">
            {/* About */}
            <div>
              <h4 className="mb-2 text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
                About
              </h4>
              <p className="text-[12px] leading-relaxed text-neutral-600">
                {company.description}
              </p>
            </div>

            <Separator className="my-5 bg-neutral-200" />

            {/* Company Info */}
            <div>
              <h4 className="mb-2 text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
                Company Info
              </h4>
              <div className="space-y-0.5">
                <InfoRow
                  icon={Calendar}
                  label="Founded"
                  value={company.founded}
                />
                <InfoRow
                  icon={People}
                  label="Employees"
                  value={company.employees}
                />
                <InfoRow
                  icon={Building}
                  label="Industry"
                  value={company.industry}
                />
                <InfoRow
                  icon={Location}
                  label="Headquarters"
                  value={company.headquarters}
                />
                <InfoRow
                  icon={Global}
                  label="Website"
                  value={company.website}
                />
              </div>
            </div>

            <Separator className="my-5 bg-neutral-200" />

            {/* Open Positions */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-[12px] font-semibold tracking-wider text-neutral-500 uppercase">
                  Open Positions
                </h4>
                <Badge
                  variant="outline"
                  className="border-neutral-200 bg-neutral-50 px-2 py-0 text-[10px] font-semibold text-neutral-600"
                >
                  {companyJobs.length}
                </Badge>
              </div>

              {companyJobs.length === 0 ? (
                <div className="flex flex-col items-center py-8 text-center">
                  <Briefcase
                    size={28}
                    variant="Linear"
                    className="mb-2 text-neutral-300"
                  />
                  <p className="text-[12px] text-neutral-500">
                    No open positions right now
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {companyJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs-listing/${job.id}`}
                      onClick={close}
                      className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:bg-neutral-50"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-neutral-900">
                          {job.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Location size={10} variant="Linear" />
                            {job.location}
                          </span>
                          <span>&middot;</span>
                          <span>{job.salary}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {job.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-neutral-100 px-2 py-0.5 text-[9px] font-medium text-neutral-600"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ArrowRight
                        size={14}
                        variant="Linear"
                        className="shrink-0 text-neutral-400"
                      />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
