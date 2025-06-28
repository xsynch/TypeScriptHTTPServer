export function middlewareLogResponses(req, res, next) {
    next();
    res.on("finish", () => {
        let statusCode = res.statusCode;
        if (statusCode < 200 || statusCode > 299) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`);
        }
    });
}
