import { neon } from "@neondatabase/serverless";

// single shared sql client for the process lifetime
const sql = neon(process.env.DATABASE_URL!);

export { sql };
