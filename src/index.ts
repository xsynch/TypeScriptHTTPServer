import express from "express";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";

import { config } from "./config.js";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware/logresponses.js";
import { handlerHitsCounter, handlerResetCounter } from "./api/hitscounter.js";
import { handlerChirps, handlerGetAllChirps, handlerGetOneChirp } from "./api/handlechirps.js";
import { errorHandler } from "./api/handleErrors.js";
import { handlerUsers } from "./api/handleUsers.js";
import { handlerLogin } from "./api/handlerLogin.js";

const PORT = 8080;

const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();


app.use(middlewareLogResponses)
app.use(express.json());




app.use("/app",middlewareMetricsInc,express.static("./src/app"));

app.get("/api/healthz",middlewareMetricsInc,handlerReadiness);
app.post("/api/users", (req,res,next) => {
    Promise.resolve(handlerUsers(req,res)).catch(next)
});

app.get('/admin/metrics', handlerHitsCounter);

app.post('/admin/reset', handlerResetCounter);

// app.post('/api/validate_chirp',(req,res,next) => {
//     Promise.resolve(handlerValidateChirp(req,res)).catch(next);
// });

app.post("/api/chirps", (req,res,next) => {
    Promise.resolve(handlerChirps(req,res).catch(next))
});

app.get("/api/chirps", (req,res,next) => {
    Promise.resolve(handlerGetAllChirps(req,res).catch(next))
});

app.get("/api/chirps/:chirpID", (req,res,next) => {
    Promise.resolve(handlerGetOneChirp(req,res).catch(next))
});

app.post("/api/login",(req,res,next) => {
    Promise.resolve(handlerLogin(req,res).catch(next))
});


app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


