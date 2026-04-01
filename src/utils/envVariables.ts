import { config } from "dotenv";

config();

export const DBUSER = process.env.PGUSER!;
export const DBPASSWORD = process.env.PGPASSWORD!;
export const DBDATABASE = process.env.PGDATABASE!;
export const DBHOST = process.env.PGHOST!;
export const DBSSL = process.env.PGSSLMODE!;
export const DBCHANNEL = process.env.PGCHANNELBINDING!;

export const DATABASE_URL = process.env.DATABASE_URL!;
export const SECRET_KEY = process.env.SECRET_KEY!;
