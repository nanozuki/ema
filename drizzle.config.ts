import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/data/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
});
