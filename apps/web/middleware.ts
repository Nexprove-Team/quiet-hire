import { type NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = [
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/onboarding',
  '/api/auth',
]

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p))
}

function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isStaticAsset(pathname) || isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('hyre.session_token')
  if (!sessionCookie) {
    return NextResponse.next()
  }

  // Fetch session from Better Auth API
  const sessionRes = await fetch(
    new URL('/api/auth/get-session', request.url),
    {
      headers: {
        cookie: request.headers.get('cookie') ?? '',
      },
    }
  )

  if (!sessionRes.ok) {
    return NextResponse.next()
  }

  const session = (await sessionRes.json()) as {
    user?: { onboardingCompleted?: boolean }
  } | null

  if (!session?.user) {
    return NextResponse.next()
  }

  if (!session.user.onboardingCompleted) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
