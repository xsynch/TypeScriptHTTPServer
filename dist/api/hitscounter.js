import { config } from "../config.js";
export async function handlerHitsCounter(_, res) {
    const counterContent = `
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>
`;
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(counterContent);
    res.end();
}
export async function handlerResetCounter(_, res) {
    config.fileserverHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send(`Hits: ${config.fileserverHits}`);
    res.end();
}
