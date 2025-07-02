import { error } from "console";
import {Request, Response} from "express";


type responseData = {
    valid: boolean;
};

type errorData = {
    error: string;
}

export async function handlerValidateChirp(req:Request, res: Response){
    
    // let body = ""
    const responseBody: responseData = {
        valid: false,
    }
    const errorBody: errorData = {
        error:"",
    }
    
    // req.on("data", (chunk) => {
    //     body += chunk;
    // });
    // req.on("end", () => {
        res.header("Content-Type","application/json");
        try {
            let parsedBody = req.body
            if(parsedBody.body.length > 140){
                errorBody.error = "Chirp is too long"
                
                res.status(400).send(JSON.stringify(errorBody))
                
            } else {
                responseBody.valid = true;
                
                res.status(200).send(JSON.stringify(responseBody));
                
            }

        } catch (error){
            const err = ensureError(error)            
            
            errorBody.error = err.message;
            res.status(400).send(JSON.stringify(errorBody))
            
        }
        res.end()
    // })
    

    
}

function ensureError(value: unknown): Error {
    if (value instanceof Error) return value;
    let stringVal = 'Something went wrong'

    const error = new Error(stringVal)
    return error;
}