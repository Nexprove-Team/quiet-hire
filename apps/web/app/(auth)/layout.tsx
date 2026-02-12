import { AuthBrandingPanel } from '@/components/auth/auth-branding-panel'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh">
      <div className="bg-card hidden lg:flex lg:w-1/2">
        <AuthBrandingPanel />
      </div>
      <div className="flex w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </div>
  )
}
