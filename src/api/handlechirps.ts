import {Request, Response} from "express";


import { createChirp, deleteChirp, getAllChirps,getOneChirp } from "../db/queries/chirps.js";
import { config } from "../config.js";
import {BadRequestError, NotFoundError, UnauthorizedError } from "./handleErrors.js";
import { getBearerToken, validateJWT } from "../middleware/auth.js";
import { selectUserPass } from "../db/queries/users.js";




type responseData = {
    cleanedBody: string;
};

type errorData = {
    error: string;
}

const bannedWords: string[] = ["KERFUFFLE", "SHARBERT","FORNAX"];

export async function handlerValidateChirp(req:Request, res: Response){
    
    
    const responseBody: responseData = {
        cleanedBody: "",
    }
    const errorBody: errorData = {
        error:"",
    }

    

        res.header("Content-Type","application/json");

            let parsedBody  = req.body
            
            if(parsedBody.body.length > 140){
                throw new BadRequestError("Chirp is too long. Max length is 140");
   
                
            } else {
                let cleanedString = "";
                for(let word of parsedBody.body.split(" ")){
                    // console.log(word);
                    if(bannedWords.indexOf(word.toUpperCase()) !== -1 ||  bannedWords.includes(word)){
                        word = "****"
                    }
                    cleanedString += `${word} `;
                }
                responseBody.cleanedBody = cleanedString.trimEnd();
                
                res.status(200).send(JSON.stringify(responseBody));
                
            }


        

    

    
}

function ensureError(value: unknown): Error {
    if (value instanceof Error) return value;
    let stringVal = 'Something went wrong'

    const error = new Error(stringVal)
    return error;
}

export async function handlerChirps(req:Request, res:Response){
    type chirpParams = {
        body: string;
        userId: string;
        token: string;
    }

    const chirpReq: chirpParams = req.body 
    const bearerToken = getBearerToken(req)
    const userId = validateJWT(bearerToken, config.api.secret)
    if (!userId){
        console.log(`Not a valid JWT ${chirpReq.token}`)
        throw new UnauthorizedError("Not a valid JWT")
    }

    const userUUID = await selectUserPass(userId)


    if (!chirpReq.body){
        throw new BadRequestError("New Chirp requires body")
    }
    if(chirpReq.body.length > 140){
        throw new BadRequestError("Chirp should be less than 140 characters")
    }
    let cleanedString = "";
    for(let word of chirpReq.body.split(" ")){
        if(bannedWords.indexOf(word.toUpperCase()) !== -1 ||  bannedWords.includes(word)){
            word = "****"
        }
        cleanedString += `${word} `;
    }
    chirpReq.body = cleanedString.trimEnd();
    const result = await createChirp({
        body: chirpReq.body,
        user_id: userUUID.id
    })            
    res.status(201).json({
        id: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        body: result.body,
        userId: result.user_id,
    })



}

export async function handlerGetAllChirps(req:Request,res:Response){
    type chirpData = {
        id: string;
        createdAt: string;
        updatedAt: string;
        body: string;
        userId: string;
    }

    const chirpResults = await getAllChirps();
    // console.log(chirpResults);
    res.status(200).json(chirpResults);
}


export async function handlerGetOneChirp(req:Request, res:Response){
        const chirpID = req.params["chirpID"]
        const result = await getOneChirp(chirpID)
        if(result){
            res.status(200).json(result)
        } else {
            throw new NotFoundError("Chirp not found")
        }
}