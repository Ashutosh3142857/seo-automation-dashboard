import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for better stability
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use Pool with proper configuration for stability
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1 // Single connection to avoid WebSocket issues
});

export const db = drizzle({ client: pool, schema });