import type {Request, Response, NextFunction } from "express";
import { config } from "../config.js";


export function middlewareLogResponses(req: Request, res: Response, next: NextFunction) {
    next();
 res.on("finish", ()=> {

    let statusCode = res.statusCode;
    
    if (statusCode < 200 || statusCode > 299){
        console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${statusCode}`)
    }

 })   
 
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
  config.api.fileserverHits++;
  next();
}

