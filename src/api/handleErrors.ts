import {Request, Response, NextFunction, response} from "express";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
  }  
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}



type errBody = {
    "error":string;
}

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
){
    let errResponse:errBody = {
        error: err.message,
    };
    res.set("Content-Type","application/json");
    if (err instanceof NotFoundError){
        res.status(404).json(errResponse);
    } else if (err instanceof ForbiddenError){
        res.status(403).json(errResponse);
    } else if (err instanceof UnauthorizedError){
        res.status(401).json(errResponse);
    } else if (err instanceof BadRequestError){
        res.status(400).json(errResponse);
    } else {
      res.status(500).json(errResponse);
    }

    console.error(err.message);
    
    
    
    

}