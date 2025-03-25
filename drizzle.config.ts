import 'dotenv/config';
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "mysql",
    schema: "./src/drizzle/schema.ts",
    out: "./drizzle",

    dbCredentials: {
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER ,
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || '',
        port: parseInt((process.env.DATABASE_PORT || "3306"),10)

    }
});