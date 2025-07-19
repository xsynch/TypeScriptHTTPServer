import {Request, Response} from "express"
import { BadRequestError, UnauthorizedError } from "./handleErrors.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../middleware/auth.js";
import { selectUserPass } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refreshtokens.js";

const ExpiresIn:number = 3600;

function addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}

export async function handlerLogin(req:Request, res:Response){
    type ParamsExpected = {
        password: string;
        email: string;
        
    }

    type cleanedUser = Partial<Omit<NewUser,"hashed_password">>
    
    let token:string = "";
    
    let params:ParamsExpected = req.body;
    // console.log(`Looking for user: ${params.email}`)
    const userCheck = await selectUserPass(params.email);
    if (!userCheck){
        console.log(`User: ${params.email} not found`)
        throw new Error("Email address not found")
    }
    if(params.email && params.password){
        const passCheck = checkPasswordHash(params.password, userCheck.hashed_password)
        if(passCheck){

            token = makeJWT(params.email, ExpiresIn,config.api.secret)
            let userRefreshTokenData = await createRefreshToken({
                user_id: userCheck.id,
                token: makeRefreshToken(),
                expiresAt: addDays(new Date(),60),
            })
            
            let cleanUser:cleanedUser = {
                id: userCheck.id,
                createdAt: userCheck.createdAt,
                updatedAt: userCheck.updatedAt,
                email: userCheck.email,
                
            }
            
            
            
            res.status(200).json({id: userCheck.id,
                createdAt: userCheck.createdAt,
                updatedAt: userCheck.updatedAt,
                email: userCheck.email,
                token: token,
                refreshToken: userRefreshTokenData.token,
                isChirpyRed: userCheck.is_chirpy_red,
            })

        } else {
            throw new UnauthorizedError("Please check your email or password")
        }

    } else {
        throw new BadRequestError("Email and password needed")
    }

}