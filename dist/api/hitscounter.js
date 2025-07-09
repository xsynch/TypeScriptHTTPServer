import { config } from "../config.js";
import { handlerResetUsers } from "./handleUsers.js";
export async function handlerHitsCounter(_, res) {
    const counterContent = `
<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>
`;
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(counterContent);
    res.end();
}
export async function handlerResetCounter(_, res) {
    config.api.fileserverHits = 0;
    await handlerResetUsers();
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send(`Hits: ${config.api.fileserverHits} and users deleted`);
    res.end();
}
