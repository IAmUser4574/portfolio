import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// lazy-init so DATABASE_URL is not required at build time
let _sql: NeonQueryFunction<false, false> | null = null;

export function getDb(): NeonQueryFunction<false, false> {
  if (!_sql) _sql = neon(process.env.DATABASE_URL!);
  return _sql;
}
