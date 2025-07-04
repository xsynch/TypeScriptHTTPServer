import { BadRequestError } from "./handleErrors.js";
const bannedWords = ["KERFUFFLE", "SHARBERT", "FORNAX"];
export async function handlerValidateChirp(req, res) {
    // let body = ""
    const responseBody = {
        cleanedBody: "",
    };
    const errorBody = {
        error: "",
    };
    // req.on("data", (chunk) => {
    //     body += chunk;
    // });
    // req.on("end", () => {
    res.header("Content-Type", "application/json");
    // try {
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
    // } catch (error){
    //     const err = ensureError(error)            
    //     errorBody.error = err.message;
    //     res.status(400).send(JSON.stringify(errorBody))
    // }
    res.end();
    // })
}
function ensureError(value) {
    if (value instanceof Error)
        return value;
    let stringVal = 'Something went wrong';
    const error = new Error(stringVal);
    return error;
}
