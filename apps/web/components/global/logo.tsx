import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { cn } from '@hackhyre/ui/lib/utils'

export function Logo({
  isJobListing,
  href,
  ...rest
}: Omit<LinkProps, 'href'> & { isJobListing?: boolean; href?: string }) {
  return (
    <Link href={href ?? '/'} className="flex items-center gap-px" {...rest}>
      <Image src="/logo.png" alt="HackHyre Logo" width={36} height={36} />
      <p
        className={cn(
          'font-mono text-2xl leading-none font-bold tracking-tight',
          isJobListing ? 'text-white' : ''
        )}
      >
        Hack<span className="text-primary">Hyre</span>
      </p>
    </Link>
  )
}
