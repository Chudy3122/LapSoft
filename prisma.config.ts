import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migracje idą przez połączenie bezpośrednie (bez poolera) — bezpieczniejsze
    // dla operacji DDL i blokad advisory. Aplikacja w runtime używa DATABASE_URL.
    url: process.env["DIRECT_URL"],
  },
});
