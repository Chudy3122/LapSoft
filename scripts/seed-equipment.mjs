/**
 * Przenosi aktualny katalog sprzętu z src/data/equipment.ts do tabeli Equipment.
 *
 * Użycie:
 *   node --env-file=.env scripts/seed-equipment.mjs
 *
 * Skrypt robi upsert po id, więc można go bezpiecznie uruchamiać ponownie.
 */
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { createRequire } from 'module'
import pg from 'pg'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const root = process.cwd()
const sourcePath = path.join(root, 'src', 'data', 'equipment.ts')
const source = fs.readFileSync(sourcePath, 'utf8')
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
})

const sandbox = {
  exports: {},
  require,
}
vm.runInNewContext(compiled.outputText, sandbox, { filename: sourcePath })

const equipment = sandbox.exports.equipment
if (!Array.isArray(equipment)) {
  console.error('Nie udało się odczytać listy equipment z src/data/equipment.ts')
  process.exit(1)
}

if (!process.env.DATABASE_URL) {
  console.error('Brak DATABASE_URL w środowisku.')
  process.exit(1)
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

try {
  await client.connect()

  for (const item of equipment) {
    await client.query(
      `
      INSERT INTO "Equipment" (
        "id",
        "category",
        "brand",
        "model",
        "image",
        "cardImage",
        "specs",
        "cardSpecs",
        "monthlyPrice",
        "units",
        "stockSource",
        "stockSyncedAt",
        "description",
        "active",
        "updatedAt"
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,$9,$10,'seed',now(),$11,true,now())
      ON CONFLICT ("id") DO UPDATE SET
        "category" = EXCLUDED."category",
        "brand" = EXCLUDED."brand",
        "model" = EXCLUDED."model",
        "image" = EXCLUDED."image",
        "cardImage" = EXCLUDED."cardImage",
        "specs" = EXCLUDED."specs",
        "cardSpecs" = EXCLUDED."cardSpecs",
        "monthlyPrice" = EXCLUDED."monthlyPrice",
        "units" = EXCLUDED."units",
        "stockSource" = EXCLUDED."stockSource",
        "stockSyncedAt" = EXCLUDED."stockSyncedAt",
        "description" = EXCLUDED."description",
        "active" = true,
        "updatedAt" = now()
      `,
      [
        item.id,
        item.category,
        item.brand,
        item.model,
        item.image,
        item.cardImage,
        JSON.stringify(item.specs ?? []),
        item.cardSpecs ? JSON.stringify(item.cardSpecs) : null,
        item.monthlyPrice ?? null,
        item.units ?? 0,
        item.description,
      ]
    )
  }

  console.log(`Zapisano sprzęt w bazie: ${equipment.length} pozycji.`)
} catch (err) {
  console.error('Błąd seedowania sprzętu:', err.message)
  process.exitCode = 1
} finally {
  await client.end()
}
