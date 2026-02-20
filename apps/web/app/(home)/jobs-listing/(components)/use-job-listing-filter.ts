'use client'

import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs'

const parsers = {
  q: parseAsString.withDefault(''),
  role: parseAsString.withDefault(''),
  location: parseAsString.withDefault('any'),
  experience: parseAsString.withDefault(''),
  period: parseAsString.withDefault('monthly'),
  salary: parseAsArrayOf(parseAsInteger).withDefault([0, 50000]),
  schedule: parseAsArrayOf(parseAsString).withDefault([
    'Full time',
    'Part time',
  ]),
  employment: parseAsArrayOf(parseAsString).withDefault([
    'Full day',
    'Flexible schedule',
    'Distant work',
  ]),
  recruiter: parseAsString.withDefault(''),
}

export function useJobListingFilter() {
  return useQueryStates(parsers, {
    history: 'push',
    clearOnDefault: true,
  })
}
