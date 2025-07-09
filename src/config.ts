
import type { MigrationConfig } from "drizzle-orm/migrator";



type APIConfig = {
  fileserverHits: number;
  port: number;
  platform: string;

};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
}

type Config = {
  api: APIConfig;
  db: DBConfig
}


process.loadEnvFile();

function checkEnvVar(key: string): string {
  
  const val = process.env[key]
  
  if(val){
    return val;
  } else {
    throw new Error("Environment variable not found")
  }
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export const dbConfig: DBConfig = {
  migrationConfig: migrationConfig,
  url: checkEnvVar('DB_URL')
}

// export let config:APIConfig = {
//   fileserverHits:0,
//   db: dbConfig,
//   platform: checkEnvVar('PLATFORM')
// }

export const config:Config = {
  api: {
    fileserverHits: 0,
    platform: checkEnvVar('PLATFORM'),    
    port: 8080,
  },
  db: {
    migrationConfig: migrationConfig,
    url: checkEnvVar('DB_URL'),
  }
}
