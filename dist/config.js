const results = process.loadEnvFile();
export let config = {
    fileserverHits: 0,
    dbURL: checkEnvVar('DB_URL'),
};
function checkEnvVar(key) {
    const val = process.env.DB_URL;
    if (val) {
        return val;
    }
    else {
        throw new Error("Environment variable not found");
    }
}
