process.loadEnvFile();
function checkEnvVar(key) {
    const val = process.env[key];
    if (val) {
        return val;
    }
    else {
        throw new Error("Environment variable not found");
    }
}
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const dbConfig = {
    migrationConfig: migrationConfig,
    url: checkEnvVar('DB_URL')
};
// export let config:APIConfig = {
//   fileserverHits:0,
//   db: dbConfig,
//   platform: checkEnvVar('PLATFORM')
// }
export const config = {
    api: {
        fileserverHits: 0,
        platform: checkEnvVar('PLATFORM'),
        port: 8080,
        secret: checkEnvVar('SECRET')
    },
    db: {
        migrationConfig: migrationConfig,
        url: checkEnvVar('DB_URL'),
    }
};
