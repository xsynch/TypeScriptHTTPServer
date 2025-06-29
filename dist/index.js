import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses, middlewareMetricsInc } from "./middleware/logresponses.js";
import { handlerHitsCounter, handlerResetCounter } from "./api/hitscounter.js";
const PORT = 8080;
const app = express();
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.get("/api/healthz", middlewareMetricsInc, handlerReadiness);
app.get('/admin/metrics', handlerHitsCounter);
app.get('/admin/reset', handlerResetCounter);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
