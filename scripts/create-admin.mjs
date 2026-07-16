/**
 * Tworzy konto administratora (rola ADMIN) albo podnosi istniejące konto do ADMIN.
 *
 * Użycie:
 *   node --env-file=.env scripts/create-admin.mjs <email> <haslo> "<Imie Nazwisko>"
 *
 * Jeśli użytkownik o podanym e-mailu już istnieje — ustawia mu rolę ADMIN
 * i (jeśli podano hasło) aktualizuje hasło.
 */
import pg from 'pg'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const [, , emailArg, passwordArg, nameArg] = process.argv

if (!emailArg || !passwordArg) {
  console.error('Użycie: node --env-file=.env scripts/create-admin.mjs <email> <haslo> "<Imie Nazwisko>"')
  process.exit(1)
}

const email = emailArg.trim().toLowerCase()
const name = (nameArg || 'Administrator').trim()

if (passwordArg.length < 8) {
  console.error('Hasło musi mieć co najmniej 8 znaków.')
  process.exit(1)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

try {
  await client.connect()
  const passwordHash = await bcrypt.hash(passwordArg, 10)

  const existing = await client.query('select id, role from "User" where email = $1', [email])

  if (existing.rowCount > 0) {
    await client.query(
      'update "User" set role = $1, "passwordHash" = $2, name = $3, "updatedAt" = now() where email = $4',
      ['ADMIN', passwordHash, name, email]
    )
    console.log(`✔ Zaktualizowano istniejące konto -> ADMIN: ${email}`)
  } else {
    const id = 'usr_' + crypto.randomBytes(12).toString('hex')
    await client.query(
      'insert into "User"(id, name, email, "passwordHash", role, "updatedAt") values ($1,$2,$3,$4,$5, now())',
      [id, name, email, passwordHash, 'ADMIN']
    )
    console.log(`✔ Utworzono konto administratora: ${email}`)
  }

  const admins = await client.query('select email, name from "User" where role = $1 order by email', ['ADMIN'])
  console.log('\nAdministratorzy w bazie:')
  for (const a of admins.rows) console.log(`  - ${a.email} (${a.name})`)
} catch (err) {
  console.error('Błąd:', err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
