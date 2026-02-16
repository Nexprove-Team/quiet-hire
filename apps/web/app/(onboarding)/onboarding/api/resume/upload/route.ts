import { put } from '@vercel/blob'
import { getSession } from '@/lib/auth-session'

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return Response.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return Response.json(
      { error: 'Invalid file type. Please upload a PDF or Word document.' },
      { status: 400 }
    )
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: 'File too large. Maximum size is 5MB.' },
      { status: 400 }
    )
  }

  const blob = await put(`resumes/${session.user.id}/${file.name}`, file, {
    access: 'public',
  })

  return Response.json({ url: blob.url })
}
