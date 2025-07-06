

const results = process.loadEnvFile();

type APIConfig = {
  fileserverHits: number;
  dbURL: string;

};


export let config:APIConfig = {
  fileserverHits:0,
  dbURL: checkEnvVar('DB_URL'),
}

function checkEnvVar(key: string): string {
  const val = process.env.DB_URL
  if(val){
    return val;
  } else {
    throw new Error("Environment variable not found")
  }
}