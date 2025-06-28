import { config } from "../config.js";
export function middlewareLogResponses(req, res, next) {
    next();
    res.on("finish", () => {
        let statusCode = res.statusCode;
        if (statusCode < 200 || statusCode > 299) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
}
export function middlewareMetricsInc(req, res, next) {
    config.fileserverHits++;
    next();
}
