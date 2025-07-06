export class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
export class ForbiddenError extends Error {
    constructor(message) {
        super(message);
    }
}
export class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
    }
}
export class BadRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
export function errorHandler(err, req, res, next) {
    let errResponse = {
        error: err.message,
    };
    res.set("Content-Type", "application/json");
    if (err instanceof NotFoundError) {
        res.status(404).json(errResponse);
    }
    else if (err instanceof ForbiddenError) {
        res.status(403).json(errResponse);
    }
    else if (err instanceof UnauthorizedError) {
        res.status(401).json(errResponse);
    }
    else if (err instanceof BadRequestError) {
        res.status(400).json(errResponse);
    }
    else {
        res.status(500).json(errResponse);
    }
    console.error(err.message);
}
