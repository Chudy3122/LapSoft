'use server'

import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'
import { RegisterSchema, LoginSchema, type AuthFormState } from '@/lib/validation'

function getSafeRedirectTo(formData: FormData, fallback: string) {
  const value = formData.get('redirectTo')
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return fallback
  }

  try {
    const url = new URL(value, 'https://lapsoft.local')
    const blockedPaths = ['/admin', '/api', '/logowanie', '/rejestracja']

    if (url.origin !== 'https://lapsoft.local' || blockedPaths.some(path => url.pathname.startsWith(path))) {
      return fallback
    }

    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return fallback
  }
}

// --- Rejestracja ---
export async function register(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const redirectTo = getSafeRedirectTo(formData, '/panel-klienta')
  const parsed = RegisterSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: z_flatten(parsed.error) }
  }

  const { name, email, password } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { errors: { email: ['Konto z tym adresem e-mail już istnieje.'] } }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  let userId: string
  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true },
    })
    userId = user.id
    await createSession({ userId: user.id, role: 'USER', name: user.name })
  } catch {
    return { message: 'Nie udało się utworzyć konta. Spróbuj ponownie.' }
  }

  void userId
  revalidatePath('/', 'layout')
  redirect(redirectTo)
}

// --- Logowanie ---
export async function login(
  _state: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const redirectTo = getSafeRedirectTo(formData, '/panel-klienta')
  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { errors: z_flatten(parsed.error) }
  }

  const { email, password } = parsed.data

  const user = await prisma.user.findUnique({ where: { email } })
  // Ten sam komunikat niezależnie od tego, czy zawodzi e-mail czy hasło (bez wycieku informacji)
  const invalid: AuthFormState = { message: 'Nieprawidłowy e-mail lub hasło.' }

  if (!user) {
    // Wykonaj porównanie mimo braku usera, by wyrównać czas odpowiedzi.
    // Hash liczony w runtime (brak literału hasha w kodzie → nie triggeruje skanerów sekretów).
    await bcrypt.compare(password, await bcrypt.hash('timing-guard', 10))
    return invalid
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return invalid

  await createSession({
    userId: user.id,
    role: user.role === 'ADMIN' ? 'ADMIN' : 'USER',
    name: user.name,
  })

  revalidatePath('/', 'layout')
  redirect(user.role === 'ADMIN' ? '/admin/dashboard' : redirectTo)
}

// --- Wylogowanie ---
export async function logout() {
  await deleteSession()
  revalidatePath('/', 'layout')
  redirect('/')
}

// Zod v4: spłaszczenie błędów pól do { field: string[] }
function z_flatten(error: {
  issues: { path: PropertyKey[]; message: string }[]
}): { name?: string[]; email?: string[]; password?: string[] } {
  const out: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0])
    ;(out[key] ??= []).push(issue.message)
  }
  return out
}
