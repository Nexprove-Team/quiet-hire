'use client'

import Link from 'next/link'
import * as motion from 'motion/react-client'
import { useState, useEffect } from 'react'
import { cn } from '@hackhyre/ui/lib/utils'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const LAST_UPDATED = 'February 20, 2026'

const SECTIONS = [
  { id: 'introduction', title: '1. Introduction' },
  { id: 'information-collected', title: '2. Information We Collect' },
  { id: 'how-we-use', title: '3. How We Use Your Information' },
  { id: 'ai-processing', title: '4. AI & Automated Processing' },
  { id: 'sharing', title: '5. Information Sharing' },
  { id: 'cookies', title: '6. Cookies & Tracking' },
  { id: 'data-retention', title: '7. Data Retention' },
  { id: 'data-security', title: '8. Data Security' },
  { id: 'your-rights', title: '9. Your Rights & Choices' },
  { id: 'international', title: '10. International Transfers' },
  { id: 'children', title: '11. Children\u2019s Privacy' },
  { id: 'third-party', title: '12. Third-Party Links' },
  { id: 'changes', title: '13. Changes to This Policy' },
  { id: 'contact', title: '14. Contact Us' },
] as const

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id)
          }
        },
        { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <section className="bg-brand-navy relative overflow-hidden">
        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Glow orb */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[oklch(0.82_0.22_155)] opacity-[0.06] blur-[120px]" />

        <div className="relative mx-auto max-w-375 px-4 pt-32 pb-16 sm:px-6 lg:px-8 lg:pt-40 lg:pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mb-4 text-xs font-semibold tracking-[0.2em] text-[oklch(0.82_0.22_155)] uppercase"
            >
              Legal
            </motion.p>
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="font-mono text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Privacy Policy
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-5 text-base leading-relaxed text-neutral-400 sm:text-lg"
            >
              Your privacy matters to us. This policy explains what data we
              collect, how we use it, and the choices you have over your
              personal information.
            </motion.p>
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-6 flex flex-wrap items-center gap-4 text-[13px] text-neutral-500"
            >
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.22_155)]" />
                Last updated: {LAST_UPDATED}
              </span>
              <span className="hidden h-3 w-px bg-neutral-700 sm:block" />
              <span className="hidden sm:inline">Effective immediately</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Content body ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-375 px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-16 xl:grid-cols-[280px_1fr]">
          {/* ── Sticky sidebar TOC ──────────────────────────────────────── */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hidden lg:block"
          >
            <nav className="sticky top-28">
              <p className="mb-4 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase">
                On this page
              </p>
              <ul className="space-y-0.5">
                {SECTIONS.map(({ id, title }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document
                          .getElementById(id)
                          ?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className={cn(
                        'block rounded-md px-3 py-1.5 text-[13px] transition-all duration-200',
                        activeSection === id
                          ? 'bg-accent font-medium text-foreground'
                          : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                      )}
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-xl border border-border bg-card p-4">
                <p className="text-[13px] font-medium text-foreground">
                  Privacy questions?
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  Our data protection team is here to help with any concerns.
                </p>
                <Link
                  href="mailto:privacy@hackhyre.com"
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary transition-colors hover:brightness-110"
                >
                  privacy@hackhyre.com
                  <svg
                    viewBox="0 0 16 16"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </Link>
              </div>
            </nav>
          </motion.aside>

          {/* ── Main content ────────────────────────────────────────────── */}
          <motion.article
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="min-w-0 max-w-none"
          >
            {/* Mobile TOC */}
            <motion.details
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="mb-10 rounded-xl border border-border bg-card p-4 lg:hidden"
            >
              <summary className="cursor-pointer text-[13px] font-semibold text-foreground">
                Table of Contents
              </summary>
              <ul className="mt-3 space-y-1.5">
                {SECTIONS.map(({ id, title }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="block text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {title}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.details>

            {/* ── Section: Introduction ───────────────────────────────── */}
            <PolicySection id="introduction" title="1. Introduction">
              <p>
                HackHyre, Inc. (&quot;HackHyre,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) is committed to protecting
                your privacy. This Privacy Policy describes how we collect, use,
                disclose, and safeguard your personal information when you use
                our AI-powered hiring platform, website, and related services
                (collectively, the &quot;Service&quot;).
              </p>
              <p>
                By accessing or using the Service, you consent to the data
                practices described in this policy. If you do not agree with
                this policy, please do not use the Service. This policy should
                be read alongside our{' '}
                <Link
                  href="/terms"
                  className="text-primary underline underline-offset-2 hover:brightness-110"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </PolicySection>

            {/* ── Section: Information Collected ──────────────────────── */}
            <PolicySection
              id="information-collected"
              title="2. Information We Collect"
            >
              <h4>Information You Provide</h4>
              <ul>
                <li>
                  <strong>Account information</strong> — name, email address,
                  password, and role selection (candidate, recruiter) when you
                  register
                </li>
                <li>
                  <strong>Profile data</strong> — resume, work experience,
                  education, skills, certifications, career preferences, salary
                  expectations, and location
                </li>
                <li>
                  <strong>Job listing data</strong> — job titles, descriptions,
                  requirements, compensation details, and company information
                  (recruiter accounts)
                </li>
                <li>
                  <strong>Application materials</strong> — cover letters,
                  portfolios, and any documents you submit when applying for
                  positions
                </li>
                <li>
                  <strong>Communications</strong> — messages sent through the
                  platform, support inquiries, and feedback
                </li>
                <li>
                  <strong>Payment information</strong> — billing address and
                  payment method details (processed by our third-party payment
                  provider; we do not store full card numbers)
                </li>
              </ul>

              <h4>Information Collected Automatically</h4>
              <ul>
                <li>
                  <strong>Device and browser data</strong> — IP address, browser
                  type and version, operating system, device identifiers, and
                  screen resolution
                </li>
                <li>
                  <strong>Usage data</strong> — pages visited, features used,
                  search queries, click patterns, session duration, and
                  referring URLs
                </li>
                <li>
                  <strong>Location data</strong> — approximate geographic
                  location derived from your IP address to display relevant job
                  listings
                </li>
                <li>
                  <strong>Cookies and similar technologies</strong> — see
                  Section 6 for details
                </li>
              </ul>

              <h4>Information from Third Parties</h4>
              <ul>
                <li>
                  <strong>OAuth providers</strong> — if you sign in via Google,
                  GitHub, or LinkedIn, we receive your name, email, and profile
                  picture from those services
                </li>
                <li>
                  <strong>Publicly available data</strong> — professional
                  information from public profiles used to enhance matching
                  accuracy
                </li>
              </ul>
            </PolicySection>

            {/* ── Section: How We Use ─────────────────────────────────── */}
            <PolicySection id="how-we-use" title="3. How We Use Your Information">
              <p>We use your personal information to:</p>
              <ul>
                <li>
                  Provide, operate, and maintain the Service, including
                  AI-powered job matching
                </li>
                <li>
                  Create and manage your account and authenticate your identity
                </li>
                <li>
                  Process job applications and facilitate connections between
                  candidates and employers
                </li>
                <li>
                  Generate compatibility scores and personalized job
                  recommendations
                </li>
                <li>
                  Send transactional communications such as application
                  confirmations, account updates, and security alerts
                </li>
                <li>
                  Send marketing communications about new features, job
                  opportunities, and platform updates (with your consent)
                </li>
                <li>
                  Analyze usage patterns to improve the Service, fix bugs, and
                  develop new features
                </li>
                <li>
                  Detect, prevent, and address fraud, abuse, and security
                  issues
                </li>
                <li>
                  Comply with legal obligations and enforce our Terms of Service
                </li>
              </ul>
            </PolicySection>

            {/* ── Section: AI Processing ──────────────────────────────── */}
            <PolicySection
              id="ai-processing"
              title="4. AI & Automated Processing"
            >
              <div className="rounded-xl border border-info/20 bg-info/5 p-4">
                <p className="text-[13px] font-semibold text-foreground">
                  Transparency Notice
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  HackHyre uses artificial intelligence to match candidates with
                  job opportunities. This section explains how our AI processes
                  your data and what controls you have.
                </p>
              </div>
              <h4>What Our AI Analyzes</h4>
              <p>
                Our AI matching system analyzes over 50 dimensions to score
                compatibility between candidates and roles, including:
              </p>
              <ul>
                <li>Skills, qualifications, and certifications</li>
                <li>Work experience and career trajectory</li>
                <li>Education and training background</li>
                <li>Location preferences and remote work compatibility</li>
                <li>Salary expectations and compensation alignment</li>
                <li>Culture fit indicators and growth potential</li>
              </ul>
              <h4>How AI Decisions Are Made</h4>
              <p>
                AI-generated matching scores are recommendations, not final
                decisions. Employers make all hiring decisions independently.
                Our AI does not use protected characteristics (race, gender,
                age, religion, disability, sexual orientation) as matching
                factors.
              </p>
              <h4>Your Controls</h4>
              <ul>
                <li>
                  You can view the factors contributing to your match score on
                  any job listing
                </li>
                <li>
                  You can update your profile to adjust how the AI evaluates
                  your compatibility
                </li>
                <li>
                  You can opt out of AI-powered recommendations through your
                  account settings
                </li>
                <li>
                  You may request a human review of any automated decision that
                  significantly affects you
                </li>
              </ul>
            </PolicySection>

            {/* ── Section: Sharing ────────────────────────────────────── */}
            <PolicySection id="sharing" title="5. Information Sharing">
              <p>
                We do not sell your personal data. We share your information
                only in the following circumstances:
              </p>
              <h4>With Employers (Candidates Only)</h4>
              <p>
                When you apply for a job, the employer receives your application
                materials, profile information, and AI-generated compatibility
                score. Your profile is not visible to employers unless you
                actively apply or opt in to the talent pool.
              </p>
              <h4>With Candidates (Employers Only)</h4>
              <p>
                When you post a job listing, candidates can view your company
                information and job details. Candidate contact information is
                shared only after they apply.
              </p>
              <h4>Service Providers</h4>
              <p>
                We share data with trusted third-party providers who help us
                operate the Service, including:
              </p>
              <ul>
                <li>
                  Cloud hosting and infrastructure (data storage and processing)
                </li>
                <li>Payment processing (billing and subscriptions)</li>
                <li>Email delivery (transactional and marketing communications)</li>
                <li>Analytics (usage patterns and performance monitoring)</li>
                <li>
                  Customer support tools (ticket management and live chat)
                </li>
              </ul>
              <p>
                All service providers are contractually obligated to protect
                your data and may only use it for the specific purposes we
                authorize.
              </p>
              <h4>Legal Requirements</h4>
              <p>
                We may disclose your information if required by law, court
                order, or governmental regulation, or if we believe disclosure
                is necessary to protect our rights, your safety, or the safety
                of others.
              </p>
              <h4>Business Transfers</h4>
              <p>
                In the event of a merger, acquisition, or sale of assets, your
                personal information may be transferred as part of the
                transaction. We will notify you of any such change and any
                choices you may have regarding your data.
              </p>
            </PolicySection>

            {/* ── Section: Cookies ────────────────────────────────────── */}
            <PolicySection id="cookies" title="6. Cookies & Tracking">
              <p>
                We use cookies and similar tracking technologies to operate and
                improve the Service. Cookies are small text files stored on your
                device that help us recognize you and remember your preferences.
              </p>
              <h4>Types of Cookies We Use</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-2 pr-6 font-semibold text-foreground">
                        Type
                      </th>
                      <th className="pb-2 pr-6 font-semibold text-foreground">
                        Purpose
                      </th>
                      <th className="pb-2 font-semibold text-foreground">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 pr-6 font-medium text-foreground">
                        Essential
                      </td>
                      <td className="py-2.5 pr-6">
                        Authentication, security, and core functionality
                      </td>
                      <td className="py-2.5">Session / 1 year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 pr-6 font-medium text-foreground">
                        Functional
                      </td>
                      <td className="py-2.5 pr-6">
                        Preferences, language, and display settings
                      </td>
                      <td className="py-2.5">1 year</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2.5 pr-6 font-medium text-foreground">
                        Analytics
                      </td>
                      <td className="py-2.5 pr-6">
                        Usage patterns, performance, and feature adoption
                      </td>
                      <td className="py-2.5">2 years</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 pr-6 font-medium text-foreground">
                        Marketing
                      </td>
                      <td className="py-2.5 pr-6">
                        Personalized content and advertising effectiveness
                      </td>
                      <td className="py-2.5">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h4>Managing Cookies</h4>
              <p>
                You can control cookies through your browser settings. Most
                browsers allow you to block or delete cookies. However,
                disabling essential cookies may affect core functionality of the
                Service. You can also manage your cookie preferences through the
                cookie banner displayed when you first visit the platform.
              </p>
              <h4>Do Not Track</h4>
              <p>
                We currently do not respond to &quot;Do Not Track&quot; browser
                signals. However, you can opt out of non-essential tracking
                through your cookie preferences at any time.
              </p>
            </PolicySection>

            {/* ── Section: Data Retention ─────────────────────────────── */}
            <PolicySection id="data-retention" title="7. Data Retention">
              <p>
                We retain your personal information for as long as your account
                is active or as needed to provide you the Service. Specific
                retention periods include:
              </p>
              <ul>
                <li>
                  <strong>Account data</strong> — retained while your account is
                  active and for 30 days after deletion to allow recovery
                </li>
                <li>
                  <strong>Application records</strong> — retained for 2 years
                  after submission for compliance and dispute resolution
                </li>
                <li>
                  <strong>Usage logs</strong> — retained for 12 months for
                  analytics and security purposes
                </li>
                <li>
                  <strong>Payment records</strong> — retained for 7 years as
                  required by tax and financial regulations
                </li>
                <li>
                  <strong>Support communications</strong> — retained for 3
                  years after the last interaction
                </li>
              </ul>
              <p>
                When data is no longer needed, we securely delete or anonymize
                it. Anonymized data that can no longer identify you may be
                retained indefinitely for statistical analysis.
              </p>
            </PolicySection>

            {/* ── Section: Data Security ──────────────────────────────── */}
            <PolicySection id="data-security" title="8. Data Security">
              <p>
                We implement industry-standard security measures to protect your
                personal information, including:
              </p>
              <ul>
                <li>
                  <strong>Encryption in transit</strong> — all data transmitted
                  between your device and our servers is encrypted using TLS 1.3
                </li>
                <li>
                  <strong>Encryption at rest</strong> — stored data is encrypted
                  using AES-256 encryption
                </li>
                <li>
                  <strong>Access controls</strong> — strict role-based access
                  controls limit who can view or modify personal data within our
                  organization
                </li>
                <li>
                  <strong>Infrastructure security</strong> — our servers are
                  hosted in SOC 2 Type II certified data centers with
                  24/7 monitoring
                </li>
                <li>
                  <strong>Regular audits</strong> — we conduct regular security
                  assessments and penetration testing
                </li>
              </ul>
              <p>
                While we take extensive precautions, no method of transmission
                over the Internet or electronic storage is 100% secure. We
                cannot guarantee absolute security but will notify you promptly
                in the event of a data breach affecting your personal
                information.
              </p>
            </PolicySection>

            {/* ── Section: Your Rights ────────────────────────────────── */}
            <PolicySection id="your-rights" title="9. Your Rights & Choices">
              <p>
                Depending on your location, you may have the following rights
                regarding your personal information:
              </p>
              <h4>Access & Portability</h4>
              <p>
                You can request a copy of the personal data we hold about you in
                a structured, commonly used, machine-readable format. You can
                also export your profile data at any time through your account
                settings.
              </p>
              <h4>Correction</h4>
              <p>
                You can update or correct your personal information at any time
                through your account profile. If you need help correcting data
                you cannot edit directly, contact us.
              </p>
              <h4>Deletion</h4>
              <p>
                You can request deletion of your account and personal data. Upon
                request, we will delete your data within 30 days, except where
                we are legally required to retain it.
              </p>
              <h4>Opt Out of Marketing</h4>
              <p>
                You can unsubscribe from marketing communications at any time by
                clicking the &quot;unsubscribe&quot; link in any email or
                through your notification settings. Transactional
                communications (account security, application updates) are not
                affected.
              </p>
              <h4>Restrict Processing</h4>
              <p>
                You can request that we restrict processing of your personal
                data in certain circumstances, such as when you contest the
                accuracy of your data or object to our processing.
              </p>
              <h4>GDPR Rights (EEA/UK Residents)</h4>
              <p>
                If you are located in the European Economic Area or the United
                Kingdom, you have additional rights under the General Data
                Protection Regulation, including the right to lodge a complaint
                with your local data protection authority.
              </p>
              <h4>CCPA Rights (California Residents)</h4>
              <p>
                If you are a California resident, you have the right to know
                what personal information we collect and share, request
                deletion, and opt out of the sale of personal information. We do
                not sell personal information.
              </p>
              <p>
                To exercise any of these rights, contact us at{' '}
                <Link
                  href="mailto:privacy@hackhyre.com"
                  className="text-primary underline underline-offset-2 hover:brightness-110"
                >
                  privacy@hackhyre.com
                </Link>
                . We will respond within 30 days.
              </p>
            </PolicySection>

            {/* ── Section: International ──────────────────────────────── */}
            <PolicySection
              id="international"
              title="10. International Transfers"
            >
              <p>
                HackHyre is based in the United States. If you access the
                Service from outside the United States, your information may be
                transferred to, stored, and processed in the United States or
                other countries where our service providers operate.
              </p>
              <p>
                When we transfer data internationally, we use appropriate
                safeguards including:
              </p>
              <ul>
                <li>
                  Standard Contractual Clauses approved by the European
                  Commission
                </li>
                <li>Data processing agreements with all service providers</li>
                <li>
                  Compliance with the EU-US Data Privacy Framework where
                  applicable
                </li>
              </ul>
              <p>
                By using the Service, you consent to the transfer of your
                information to the United States and other countries that may
                have different data protection laws than your jurisdiction.
              </p>
            </PolicySection>

            {/* ── Section: Children ───────────────────────────────────── */}
            <PolicySection id="children" title="11. Children&rsquo;s Privacy">
              <p>
                The Service is not intended for individuals under the age of 18.
                We do not knowingly collect personal information from children
                under 18. If we become aware that we have collected data from a
                child under 18, we will take steps to delete that information
                promptly.
              </p>
              <p>
                If you believe that a child under 18 has provided us with
                personal information, please contact us at{' '}
                <Link
                  href="mailto:privacy@hackhyre.com"
                  className="text-primary underline underline-offset-2 hover:brightness-110"
                >
                  privacy@hackhyre.com
                </Link>{' '}
                so we can take appropriate action.
              </p>
            </PolicySection>

            {/* ── Section: Third-Party Links ──────────────────────────── */}
            <PolicySection id="third-party" title="12. Third-Party Links">
              <p>
                The Service may contain links to third-party websites, services,
                or applications that are not operated by HackHyre. This includes
                employer websites, social media profiles, and external job
                boards.
              </p>
              <p>
                We have no control over and assume no responsibility for the
                content, privacy policies, or practices of any third-party
                sites. We encourage you to review the privacy policy of every
                site you visit.
              </p>
            </PolicySection>

            {/* ── Section: Changes ────────────────────────────────────── */}
            <PolicySection id="changes" title="13. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in our practices, technology, legal requirements, or
                other factors. When we make material changes, we will:
              </p>
              <ul>
                <li>
                  Post the updated policy on this page with a new &quot;Last
                  updated&quot; date
                </li>
                <li>
                  Notify you by email if the changes significantly affect how we
                  use your personal data
                </li>
                <li>
                  Provide at least 30 days&apos; notice before material changes
                  take effect
                </li>
              </ul>
              <p>
                Your continued use of the Service after any changes constitutes
                acceptance of the updated policy. We encourage you to review
                this page periodically for the latest information.
              </p>
            </PolicySection>

            {/* ── Section: Contact ────────────────────────────────────── */}
            <PolicySection id="contact" title="14. Contact Us" last>
              <p>
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us:
              </p>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="space-y-2.5 text-[14px]">
                  <div className="flex items-start gap-3">
                    <span className="w-24 shrink-0 text-[13px] font-medium text-muted-foreground">
                      Privacy team
                    </span>
                    <Link
                      href="mailto:privacy@hackhyre.com"
                      className="text-primary hover:brightness-110"
                    >
                      privacy@hackhyre.com
                    </Link>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-24 shrink-0 text-[13px] font-medium text-muted-foreground">
                      General
                    </span>
                    <Link
                      href="mailto:legal@hackhyre.com"
                      className="text-primary hover:brightness-110"
                    >
                      legal@hackhyre.com
                    </Link>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-24 shrink-0 text-[13px] font-medium text-muted-foreground">
                      Address
                    </span>
                    <span className="text-foreground">
                      HackHyre, Inc.
                      <br />
                      Wilmington, Delaware, USA
                    </span>
                  </div>
                </div>
              </div>
              <p>
                For GDPR-related inquiries, you may also contact your local data
                protection authority. We aim to respond to all privacy requests
                within 30 days.
              </p>
            </PolicySection>
          </motion.article>
        </div>
      </section>
    </div>
  )
}

/* ── Reusable section wrapper ─────────────────────────────────────────────── */

function PolicySection({
  id,
  title,
  children,
  last = false,
}: {
  id: string
  title: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <motion.section
      id={id}
      variants={fadeUp}
      transition={{ duration: 0.4 }}
      className={cn(
        'scroll-mt-28',
        !last && 'mb-10 border-b border-border pb-10'
      )}
    >
      <h2 className="font-mono text-xl font-bold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-[1.75] text-muted-foreground [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-[15px] [&_h4]:font-semibold [&_h4]:text-foreground [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-[0.7em] [&_li]:before:left-0 [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-primary/40 [&_strong]:font-semibold [&_strong]:text-foreground [&_table]:mt-2 [&_ul]:space-y-2">
        {children}
      </div>
    </motion.section>
  )
}
