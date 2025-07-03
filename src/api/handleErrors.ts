import {Request, Response, NextFunction, response} from "express";


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
        error: "Something went wrong on our end",
    };
    console.error(err.message);
    res.set("Content-Type","application/json");
    res.status(500).json(errResponse);
    
    

}