import { createChirp, deleteChirp, getAllChirps, getOneChirp, getChirpsByUser, getChirpsAscending, getChirpsDescending } from "../db/queries/chirps.js";
import { config } from "../config.js";
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from "./handleErrors.js";
import { getBearerToken, validateJWT } from "../middleware/auth.js";
import { selectUserPass } from "../db/queries/users.js";
const bannedWords = ["KERFUFFLE", "SHARBERT", "FORNAX"];
export async function handlerValidateChirp(req, res) {
    const responseBody = {
        cleanedBody: "",
    };
    const errorBody = {
        error: "",
    };
    res.header("Content-Type", "application/json");
    let parsedBody = req.body;
    if (parsedBody.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    else {
        let cleanedString = "";
        for (let word of parsedBody.body.split(" ")) {
            // console.log(word);
            if (bannedWords.indexOf(word.toUpperCase()) !== -1 || bannedWords.includes(word)) {
                word = "****";
            }
            cleanedString += `${word} `;
        }
        responseBody.cleanedBody = cleanedString.trimEnd();
        res.status(200).send(JSON.stringify(responseBody));
    }
}
function ensureError(value) {
    if (value instanceof Error)
        return value;
    let stringVal = 'Something went wrong';
    const error = new Error(stringVal);
    return error;
}
export async function handlerChirps(req, res) {
    const chirpReq = req.body;
    const bearerToken = getBearerToken(req);
    const userId = validateJWT(bearerToken, config.api.secret);
    if (!userId) {
        console.log(`Not a valid JWT ${bearerToken}`);
        throw new UnauthorizedError("Not a valid JWT");
    }
    const userUUID = await selectUserPass(userId);
    if (!chirpReq.body) {
        throw new BadRequestError("New Chirp requires body");
    }
    if (chirpReq.body.length > 140) {
        throw new BadRequestError("Chirp should be less than 140 characters");
    }
    let cleanedString = "";
    for (let word of chirpReq.body.split(" ")) {
        if (bannedWords.indexOf(word.toUpperCase()) !== -1 || bannedWords.includes(word)) {
            word = "****";
        }
        cleanedString += `${word} `;
    }
    chirpReq.body = cleanedString.trimEnd();
    const result = await createChirp({
        body: chirpReq.body,
        user_id: userUUID.id
    });
    res.status(201).json({
        id: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        body: result.body,
        userId: result.user_id,
    });
}
export async function handlerGetAllChirps(req, res) {
    let sort = "";
    let sortQuery = req.query.sort;
    if (typeof sortQuery === "string") {
        sort = sortQuery;
    }
    if (sort && sort === "asc") {
        const resultAscending = await getChirpsAscending();
        res.status(200).json(resultAscending);
        return;
    }
    else if (sort && sort === "desc") {
        const resultsDescending = await getChirpsDescending();
        console.log("sorting chirps descending");
        res.status(200).json(resultsDescending);
        return;
    }
    let authID = "";
    let authQuery = req.query.authorId;
    if (typeof authQuery === "string") {
        authID = authQuery;
    }
    if (!authID) {
        const chirpResults = await getAllChirps();
        res.status(200).json(chirpResults);
    }
    else {
        const userChiprs = await getChirpsByUser(authID);
        if (userChiprs) {
            res.status(200).json(userChiprs);
        }
        else {
            throw new Error("No chirps found for the user");
        }
    }
}
export async function handlerGetOneChirp(req, res) {
    const chirpID = req.params["chirpID"];
    const result = await getOneChirp(chirpID);
    if (result) {
        res.status(200).json(result);
    }
    else {
        throw new NotFoundError("Chirp not found");
    }
}
export async function handlerDeleteChirp(req, res) {
    const token = getBearerToken(req);
    const userEmailFromToken = validateJWT(token, config.api.secret);
    const chirpID = req.params["chirpID"];
    const chirpResult = await getOneChirp(chirpID);
    if (chirpResult) {
        const userEmailFromDb = await selectUserPass(userEmailFromToken);
        if (chirpResult.user_id != userEmailFromDb.id) {
            console.log(`${userEmailFromToken} tried to delete ${userEmailFromDb.email}'s chirp`);
            console.log(`chirp owner id: ${chirpResult.id} users id from db ${userEmailFromDb.id}'s chirp`);
            throw new ForbiddenError("User cannot delete another user's chirp");
        }
        else {
            const result = await deleteChirp(chirpID);
            if (result) {
                res.status(204).json({
                    success: true,
                });
            }
            else {
                throw new Error("Failure deleting chirp from the database");
            }
        }
    }
    else {
        throw new NotFoundError("Could not find chirp");
    }
}
