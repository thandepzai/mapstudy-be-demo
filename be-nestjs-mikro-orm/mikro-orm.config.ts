import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  dbName: 'postgres',
  schema: 'public',
  clientUrl:
    'postgresql://postgres.nxhrxupgtccqnugvawmz:Top1yasuo20k1@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres',
  driverOptions: {
    connection: { ssl: { rejectUnauthorized: false } },
  },
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    transactional: true,
    allOrNothing: true,
    safe: true,
  },
});
