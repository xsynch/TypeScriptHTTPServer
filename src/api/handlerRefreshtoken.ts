import {Request, response, Response} from "express"
import { getBearerToken, makeJWT } from "../middleware/auth.js"
import { revokeRefreshToken,  selectUserFromToken } from "../db/queries/refreshtokens.js"
import { UnauthorizedError } from "./handleErrors.js"
import { config } from "../config.js"
import { selectEmailFromID } from "../db/queries/users.js"


export async function handlerRefreshToken(req:Request, res:Response){
    const token = getBearerToken(req)
    const userInfo = await selectUserFromToken(token)
    const userEmail = await selectEmailFromID(userInfo.user_id)
    
    const date = new Date()
    if(userInfo){
        if(userInfo.revokedAt && userInfo.revokedAt < date ){
            throw new UnauthorizedError("Session has expired")
        }
        console.log(`Creating new JWT for ${userEmail.email} which should be an email address`)
        const newToken = makeJWT(userEmail.email, 3600, config.api.secret)
        res.status(200).json({
            token: newToken
        });

    } else {
        throw new UnauthorizedError("Please try a different user")
    }
    
}

export async function handlerRevokeRefreshToken(req:Request, res:Response){
    type paramsExpected = {
        token: string,
    }
    let params:paramsExpected = {
        token: getBearerToken(req)
    }
    const result = await revokeRefreshToken(params.token)
    if(result){
        res.status(204).send();
    } else {
        throw new Error("Could not revoke token")
    }
}