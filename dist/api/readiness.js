export async function handlerReadiness(_, res) {
    res.set('Content-Type', 'text/plain; charset=utf-i');
    res.send('OK');
    res.end();
}
