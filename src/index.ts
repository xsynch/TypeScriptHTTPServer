import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware/logresponses.js";
import { handlerHitsCounter, handlerResetCounter } from "./api/hitscounter.js";
import { handlerValidateChirp } from "./api/handlechirps.js";
import { errorHandler } from "./api/handleErrors.js";

const PORT = 8080;

const app = express();


app.use(middlewareLogResponses)
app.use(express.json());




app.use("/app",middlewareMetricsInc,express.static("./src/app"));

app.get("/api/healthz",middlewareMetricsInc,handlerReadiness);

app.get('/admin/metrics', handlerHitsCounter);

app.post('/admin/reset', handlerResetCounter);

app.post('/api/validate_chirp',(req,res,next) => {
    Promise.resolve(handlerValidateChirp(req,res)).catch(next);
});
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


