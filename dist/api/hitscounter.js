import { config } from "../config.js";
export async function handlerHitsCounter(_, res) {
    res.set('Content-Type', 'text/plain; charset=utf-i');
    res.send(`Hits: ${config.fileserverHits}`);
    res.end();
}
export async function handlerResetCounter(_, res) {
    config.fileserverHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-i');
    res.send(`Hits: ${config.fileserverHits}`);
    res.end();
}
