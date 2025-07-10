import { createChirp, getAllChirps, getOneChirp } from "../db/queries/chirps.js";
import { BadRequestError, NotFoundError } from "./handleErrors.js";
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
    if (!chirpReq.body || !chirpReq.userId) {
        throw new BadRequestError("New Chirp requires body and userid ");
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
        user_id: chirpReq.userId
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
    const chirpResults = await getAllChirps();
    // console.log(chirpResults);
    res.status(200).json(chirpResults);
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
