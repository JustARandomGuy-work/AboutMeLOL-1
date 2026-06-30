<<<<<<< HEAD
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const dbClient = drizzle(pool, { schema });

export default dbClient;
=======
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const dbClient = drizzle(pool, { schema });

export default dbClient;
>>>>>>> aee9477181ceb519ab7930d588f6fed3b340e70c
