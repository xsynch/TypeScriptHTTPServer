export function errorHandler(err, req, res, next) {
    let errResponse = {
        error: "Something went wrong on our end",
    };
    console.error(err.message);
    res.set("Content-Type", "application/json");
    res.status(500).json(errResponse);
}
