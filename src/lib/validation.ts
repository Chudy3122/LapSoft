import * as z from 'zod'

// Schemat rejestracji
export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { error: 'Imię musi mieć co najmniej 2 znaki.' })
    .max(80, { error: 'Imię jest za długie.' }),
  email: z
    .email({ error: 'Podaj poprawny adres e-mail.' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { error: 'Hasło musi mieć co najmniej 8 znaków.' })
    .regex(/[a-zA-Z]/, { error: 'Hasło musi zawierać literę.' })
    .regex(/[0-9]/, { error: 'Hasło musi zawierać cyfrę.' }),
})

// Schemat logowania
export const LoginSchema = z.object({
  email: z.email({ error: 'Podaj poprawny adres e-mail.' }).trim().toLowerCase(),
  password: z.string().min(1, { error: 'Podaj hasło.' }),
})

export type RegisterInput = z.infer<typeof RegisterSchema>
export type LoginInput = z.infer<typeof LoginSchema>

// Stan formularza zwracany przez server actions do useActionState
export type AuthFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
