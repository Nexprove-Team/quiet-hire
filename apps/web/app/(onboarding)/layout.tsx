import { AuthBrandingPanel } from '@/components/auth/auth-branding-panel'

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-svh w-full overflow-hidden">
      <div className="bg-card hidden h-full lg:flex lg:w-1/2">
        <AuthBrandingPanel />
      </div>
      <div className="bg-background flex h-full w-full flex-col overflow-hidden px-4 py-4 lg:w-1/2">
        {children}
      </div>
    </div>
  )
}
