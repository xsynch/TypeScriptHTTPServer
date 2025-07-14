import { describe, it, expect, beforeAll } from "vitest";
import { makeJWT, validateJWT } from "./auth";
import { hashPassword, checkPasswordHash } from "./auth";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 =  hashPassword(password1);
    hash2 = hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });
});

describe("Jwt Creation and Validation", () => {
    const userID = "jonathan";
    const expiresIn = 5;
    const secret = "this is a secret string";
    let token: string;

    beforeAll(() => {
        token = makeJWT(userID,expiresIn,secret)
    })

    it(("should return a valid jwt"), () => {
        expect(token).toBeDefined()
    })

    it(("userid should be jonathan"), () => {
        const result = validateJWT(token, secret)
        expect(result).toBe("jonathan")
    })
})