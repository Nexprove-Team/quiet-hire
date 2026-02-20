export function shrinkString({
  text,
  prefixLength = 5,
  afterLength = 4,
  useDot = true,
  shrinkHolderNo = 3,
}: {
  text: string
  prefixLength?: number
  afterLength?: number
  useDot?: boolean
  shrinkHolderNo?: number
}): string {
  if (text.length <= 10) {
    return text
  }

  const prefix = text.slice(0, prefixLength)
  const suffix = text.slice(-afterLength)
  const shrinkHolderLength = useDot
    ? '.'.repeat(shrinkHolderNo)
    : '*'.repeat(shrinkHolderNo)

  return useDot
    ? `${prefix}${shrinkHolderLength}${suffix}`
    : `${prefix}${shrinkHolderLength}${suffix}`
}
