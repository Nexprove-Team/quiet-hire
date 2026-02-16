export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 8)
  return `${base}-${suffix}`
}
