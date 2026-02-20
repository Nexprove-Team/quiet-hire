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
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'eligibility', title: '2. Eligibility' },
  { id: 'accounts', title: '3. Account Registration' },
  { id: 'services', title: '4. Services Description' },
  { id: 'use', title: '5. Acceptable Use' },
  { id: 'content', title: '6. User Content' },
  { id: 'ip', title: '7. Intellectual Property' },
  { id: 'privacy', title: '8. Privacy & Data' },
  { id: 'payments', title: '9. Payments & Billing' },
  { id: 'termination', title: '10. Termination' },
  { id: 'disclaimers', title: '11. Disclaimers' },
  { id: 'liability', title: '12. Limitation of Liability' },
  { id: 'indemnification', title: '13. Indemnification' },
  { id: 'disputes', title: '14. Dispute Resolution' },
  { id: 'changes', title: '15. Changes to Terms' },
  { id: 'contact', title: '16. Contact Us' },
] as const

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState<string>('acceptance')

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
              Terms of Service
            </motion.h1>
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.5 }}
              className="mt-5 text-base leading-relaxed text-neutral-400 sm:text-lg"
            >
              Please read these terms carefully before using HackHyre. By
              accessing or using our platform, you agree to be bound by these
              terms.
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
                  Questions?
                </p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                  If you have any questions about these terms, please reach out.
                </p>
                <Link
                  href="mailto:legal@hackhyre.com"
                  className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary transition-colors hover:brightness-110"
                >
                  legal@hackhyre.com
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

            {/* ── Section: Acceptance ──────────────────────────────────── */}
            <TermsSection id="acceptance" title="1. Acceptance of Terms">
              <p>
                By accessing or using the HackHyre platform (&quot;Service&quot;),
                including our website, applications, APIs, and any related services,
                you agree to be bound by these Terms of Service (&quot;Terms&quot;).
                If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p>
                These Terms constitute a legally binding agreement between you and
                HackHyre, Inc. (&quot;HackHyre,&quot; &quot;we,&quot; &quot;us,&quot;
                or &quot;our&quot;). We may update these Terms from time to time,
                and your continued use of the Service after any changes constitutes
                acceptance of the revised Terms.
              </p>
            </TermsSection>

            {/* ── Section: Eligibility ────────────────────────────────── */}
            <TermsSection id="eligibility" title="2. Eligibility">
              <p>To use HackHyre, you must:</p>
              <ul>
                <li>
                  Be at least 18 years old or the age of majority in your
                  jurisdiction
                </li>
                <li>
                  Have the legal capacity to enter into a binding agreement
                </li>
                <li>
                  Not be prohibited from using the Service under applicable law
                </li>
                <li>
                  Provide accurate and complete registration information
                </li>
              </ul>
              <p>
                If you are using the Service on behalf of an organization, you
                represent and warrant that you have the authority to bind that
                organization to these Terms.
              </p>
            </TermsSection>

            {/* ── Section: Account Registration ───────────────────────── */}
            <TermsSection id="accounts" title="3. Account Registration">
              <p>
                When you create an account on HackHyre, you agree to provide
                accurate, current, and complete information. You are responsible
                for maintaining the confidentiality of your account credentials
                and for all activities that occur under your account.
              </p>
              <h4>Account Types</h4>
              <ul>
                <li>
                  <strong>Candidate accounts</strong> are for individuals seeking
                  employment opportunities. Candidates may create profiles, browse
                  and apply for jobs, and receive AI-powered matching recommendations.
                </li>
                <li>
                  <strong>Recruiter accounts</strong> are for employers and hiring
                  professionals. Recruiters may post job listings, search our talent
                  pool, and manage applications through our platform.
                </li>
                <li>
                  <strong>Admin accounts</strong> are reserved for authorized
                  HackHyre personnel only.
                </li>
              </ul>
              <p>
                You must notify us immediately of any unauthorized use of your
                account or any other breach of security. HackHyre will not be
                liable for any losses caused by unauthorized use of your account.
              </p>
            </TermsSection>

            {/* ── Section: Services Description ───────────────────────── */}
            <TermsSection id="services" title="4. Services Description">
              <p>
                HackHyre provides an AI-powered hiring platform that connects
                job seekers with employers through intelligent matching technology.
                Our services include but are not limited to:
              </p>
              <ul>
                <li>
                  AI-driven candidate-job matching across 50+ compatibility
                  dimensions
                </li>
                <li>Job listing creation, distribution, and management</li>
                <li>Candidate profile creation and talent pool access</li>
                <li>Application tracking and communication tools</li>
                <li>Skill assessments and career resource tools</li>
                <li>Hiring analytics and insights for employers</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any
                aspect of the Service at any time, with or without notice. We
                shall not be liable to you or any third party for any modification,
                suspension, or discontinuation of the Service.
              </p>
            </TermsSection>

            {/* ── Section: Acceptable Use ─────────────────────────────── */}
            <TermsSection id="use" title="5. Acceptable Use">
              <p>
                You agree not to use the Service for any unlawful purpose or in
                any way that could damage, disable, or impair the Service.
                Specifically, you agree not to:
              </p>
              <ul>
                <li>
                  Post false, misleading, or fraudulent job listings or
                  candidate profiles
                </li>
                <li>
                  Scrape, crawl, or use automated means to access the Service
                  without our express written permission
                </li>
                <li>
                  Attempt to gain unauthorized access to other users&apos;
                  accounts or any part of the Service
                </li>
                <li>
                  Use the Service to discriminate against any individual or group
                  based on protected characteristics
                </li>
                <li>
                  Transmit any viruses, malware, or other harmful code through
                  the Service
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Service
                </li>
                <li>
                  Use the Service to send unsolicited communications or spam
                </li>
                <li>
                  Reverse-engineer, decompile, or disassemble any aspect of the
                  Service
                </li>
              </ul>
              <p>
                We reserve the right to suspend or terminate your account if we
                determine, in our sole discretion, that you have violated these
                terms.
              </p>
            </TermsSection>

            {/* ── Section: User Content ───────────────────────────────── */}
            <TermsSection id="content" title="6. User Content">
              <p>
                You retain ownership of all content you submit to the Service,
                including profile information, resumes, job listings, and
                communications (&quot;User Content&quot;). By submitting User
                Content, you grant HackHyre a worldwide, non-exclusive,
                royalty-free license to use, reproduce, modify, and display your
                User Content solely for the purpose of operating and improving
                the Service.
              </p>
              <p>You represent and warrant that:</p>
              <ul>
                <li>
                  You own or have the necessary rights to your User Content
                </li>
                <li>
                  Your User Content does not infringe on the intellectual
                  property rights of any third party
                </li>
                <li>
                  Your User Content is accurate and not misleading
                </li>
                <li>
                  Your User Content complies with all applicable laws and
                  regulations
                </li>
              </ul>
              <p>
                We may remove or disable access to any User Content that we
                believe violates these Terms or is otherwise objectionable,
                without prior notice.
              </p>
            </TermsSection>

            {/* ── Section: IP ─────────────────────────────────────────── */}
            <TermsSection id="ip" title="7. Intellectual Property">
              <p>
                The Service and all of its contents, features, and functionality
                (including but not limited to software, algorithms, text,
                graphics, logos, and design) are owned by HackHyre and are
                protected by copyright, trademark, patent, and other
                intellectual property laws.
              </p>
              <p>
                The HackHyre name, logo, and all related names, logos, product
                and service names, designs, and slogans are trademarks of
                HackHyre. You may not use such marks without our prior written
                permission.
              </p>
              <p>
                Our AI matching algorithms, scoring systems, and recommendation
                engines constitute proprietary technology. You may not copy,
                replicate, or create derivative works based on our technology.
              </p>
            </TermsSection>

            {/* ── Section: Privacy ────────────────────────────────────── */}
            <TermsSection id="privacy" title="8. Privacy & Data">
              <p>
                Your use of the Service is also governed by our{' '}
                <Link href="/privacy" className="text-primary underline underline-offset-2 hover:brightness-110">
                  Privacy Policy
                </Link>
                , which is incorporated into these Terms by reference. Please
                review our Privacy Policy to understand how we collect, use, and
                protect your personal information.
              </p>
              <h4>AI & Data Processing</h4>
              <p>
                By using the Service, you acknowledge that our AI systems
                process your data to provide matching recommendations. This
                includes analyzing your profile information, skills, experience,
                and preferences. We use industry-standard encryption and never
                sell your personal data to third parties.
              </p>
              <p>
                You maintain full control over your profile visibility and can
                choose to make your profile private at any time. Your information
                is only shared with potential employers when you actively apply
                for a position.
              </p>
            </TermsSection>

            {/* ── Section: Payments ───────────────────────────────────── */}
            <TermsSection id="payments" title="9. Payments & Billing">
              <p>
                Certain features of the Service may require payment. If you
                choose to use paid features, you agree to pay all applicable
                fees as described on the Service.
              </p>
              <ul>
                <li>
                  <strong>Candidate accounts</strong> are free to use. Core job
                  search, matching, and application features are available at no
                  cost.
                </li>
                <li>
                  <strong>Recruiter accounts</strong> may be subject to
                  subscription fees based on the plan selected. Pricing details
                  are available on our pricing page.
                </li>
              </ul>
              <p>
                All fees are non-refundable unless otherwise stated. We reserve
                the right to change our pricing at any time, with advance notice
                to affected users. Failure to pay applicable fees may result in
                suspension or termination of your account.
              </p>
            </TermsSection>

            {/* ── Section: Termination ────────────────────────────────── */}
            <TermsSection id="termination" title="10. Termination">
              <p>
                You may terminate your account at any time by contacting us or
                through your account settings. We may terminate or suspend your
                access to the Service immediately, without prior notice, if:
              </p>
              <ul>
                <li>You breach any provision of these Terms</li>
                <li>
                  We are required to do so by law or a governmental authority
                </li>
                <li>
                  We decide to discontinue the Service or any part thereof
                </li>
                <li>
                  There are unexpected technical or security issues
                </li>
              </ul>
              <p>
                Upon termination, your right to use the Service will immediately
                cease. We may delete your account data in accordance with our
                data retention policies, except where we are required by law to
                retain certain information.
              </p>
            </TermsSection>

            {/* ── Section: Disclaimers ────────────────────────────────── */}
            <TermsSection id="disclaimers" title="11. Disclaimers">
              <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
                <p className="text-[13px] font-semibold text-foreground">
                  Important Notice
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  The Service is provided on an &quot;as is&quot; and &quot;as
                  available&quot; basis. HackHyre makes no warranties, express
                  or implied, regarding the Service, including but not limited to
                  implied warranties of merchantability, fitness for a particular
                  purpose, and non-infringement.
                </p>
              </div>
              <p>
                We do not guarantee that the Service will be uninterrupted,
                secure, or error-free. We do not guarantee the accuracy or
                reliability of AI-generated matching scores or recommendations.
                We do not verify or endorse any employers or candidates on the
                platform.
              </p>
              <p>
                HackHyre is a technology platform that facilitates connections
                between job seekers and employers. We are not an employment
                agency and do not guarantee employment outcomes.
              </p>
            </TermsSection>

            {/* ── Section: Liability ──────────────────────────────────── */}
            <TermsSection id="liability" title="12. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, HackHyre and its
                directors, employees, partners, agents, and affiliates shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, including without limitation, loss of
                profits, data, use, goodwill, or other intangible losses,
                resulting from:
              </p>
              <ul>
                <li>Your access to or use of (or inability to access or use) the Service</li>
                <li>Any conduct or content of any third party on the Service</li>
                <li>Any content obtained from the Service</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content</li>
              </ul>
              <p>
                In no event shall HackHyre&apos;s total liability to you for all
                claims exceed the amount you have paid to HackHyre in the twelve
                (12) months preceding the claim, or one hundred dollars ($100),
                whichever is greater.
              </p>
            </TermsSection>

            {/* ── Section: Indemnification ────────────────────────────── */}
            <TermsSection id="indemnification" title="13. Indemnification">
              <p>
                You agree to defend, indemnify, and hold harmless HackHyre and
                its officers, directors, employees, and agents from and against
                any claims, damages, obligations, losses, liabilities, costs, or
                debt arising from:
              </p>
              <ul>
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>
                  Your violation of any third party right, including any
                  intellectual property or privacy right
                </li>
                <li>
                  Any claim that your User Content caused damage to a third party
                </li>
              </ul>
            </TermsSection>

            {/* ── Section: Dispute Resolution ─────────────────────────── */}
            <TermsSection id="disputes" title="14. Dispute Resolution">
              <h4>Governing Law</h4>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Delaware, without regard to its
                conflict of law provisions.
              </p>
              <h4>Arbitration</h4>
              <p>
                Any dispute arising out of or relating to these Terms or the
                Service shall be resolved through binding arbitration in
                accordance with the rules of the American Arbitration
                Association. The arbitration shall be conducted in English and
                take place in Wilmington, Delaware.
              </p>
              <h4>Class Action Waiver</h4>
              <p>
                You agree that any dispute resolution proceedings will be
                conducted only on an individual basis and not in a class,
                consolidated, or representative action.
              </p>
            </TermsSection>

            {/* ── Section: Changes ────────────────────────────────────── */}
            <TermsSection id="changes" title="15. Changes to Terms">
              <p>
                We reserve the right to modify these Terms at any time. When we
                make material changes, we will notify you by email or through a
                prominent notice on the Service at least 30 days before the
                changes take effect.
              </p>
              <p>
                Your continued use of the Service following the posting of
                revised Terms means that you accept and agree to the changes. If
                you do not agree to the new Terms, you should stop using the
                Service and may request deletion of your account.
              </p>
            </TermsSection>

            {/* ── Section: Contact ────────────────────────────────────── */}
            <TermsSection id="contact" title="16. Contact Us" last>
              <p>
                If you have any questions about these Terms of Service, please
                contact us:
              </p>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="space-y-2.5 text-[14px]">
                  <div className="flex items-start gap-3">
                    <span className="w-16 shrink-0 text-[13px] font-medium text-muted-foreground">
                      Email
                    </span>
                    <Link
                      href="mailto:legal@hackhyre.com"
                      className="text-primary hover:brightness-110"
                    >
                      legal@hackhyre.com
                    </Link>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-16 shrink-0 text-[13px] font-medium text-muted-foreground">
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
            </TermsSection>
          </motion.article>
        </div>
      </section>
    </div>
  )
}

/* ── Reusable section wrapper ─────────────────────────────────────────────── */

function TermsSection({
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
      <div className="terms-content mt-4 space-y-4 text-[15px] leading-[1.75] text-muted-foreground [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-[15px] [&_h4]:font-semibold [&_h4]:text-foreground [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:top-[0.7em] [&_li]:before:left-0 [&_li]:before:h-1.5 [&_li]:before:w-1.5 [&_li]:before:rounded-full [&_li]:before:bg-primary/40 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:space-y-2">
        {children}
      </div>
    </motion.section>
  )
}
