import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma 7 + driver adapter (pg): CAŁY łańcuch musi być wymagany z node_modules
  // jako jedna spójna kopia we wszystkich warstwach (RSC / server action / route handler),
  // inaczej instancja adaptera i runtime się rozjeżdżają → "adapterFn is not a function".
  serverExternalPackages: [
    '@prisma/client',
    '@prisma/adapter-pg',
    '@prisma/driver-adapter-utils',
    'pg',
    'postgres-array',
  ],
};

export default nextConfig;
