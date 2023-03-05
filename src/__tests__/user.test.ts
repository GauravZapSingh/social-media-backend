import mongoose from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/createServer";
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();

const userSignupPayload = {
    message: {
        msgBody: "Account Created",
        msgError: false,
        session: {
            sessionId: expect.any(String),
            email: "test@example.com",
            name: "Jane Doe",
            userId: expect.any(String),
            role: "admin",
            valid: true
        },
        user: [
            {
                _id: expect.any(String),
                name: "Jane Doe",
                email: "test@example.com",
                password: expect.any(String),
                role: "admin",
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }
        ]
    }
};

const userLoginPayload = {
    ...userSignupPayload, 
    message: {
        ...userSignupPayload.message,
        msgBody: "Logged In"
    }
}

const userInput = {
    email: "test@example.com",
    name: "Jane Doe",
    password: "Password123",
    role: "admin"
};

const sessionPayload = {
    sessionId: "1",
    email: "test@example.com",
    name: "Jane Doe",
    userId: userId,
    role: "admin",
    valid: true
};

describe("user", () => {
    beforeAll(async () => {
        process.env.JWT_SECRET = JWT_SECRET;
        const mongoServer = await MongoMemoryServer.create();
    
        await mongoose.connect(mongoServer.getUri());
    });
    
    afterAll(async () => {
        process.env.JWT_SECRET = undefined;
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    // user registration
    describe("user registration", () => {
        describe("given the username and password are valid", () => {
            it("should return the user payload", async () => {

                const { statusCode, body } = await supertest(app)
                .post("/api/user/signup")
                .send(userInput);

                expect(statusCode).toBe(200);

                expect(body).toEqual(userSignupPayload);
            });
        });
    });

    describe("create user session", () => {
        describe("given the username and password are not valid", () => {
            it("should return user status 500", async () => {
                const { statusCode, body } = await supertest(app)
                .post("/api/user/login")
                .send(userInput);

                expect(statusCode).toBe(500);

                expect(body).toEqual(userLoginPayload);
            });
        });

        describe("given the username and password are valid", () => {
            it("should return user detail", async () => {
                const { statusCode, body } = await supertest(app)
                .post("/api/user/login")
                .send(userInput);

                expect(statusCode).toBe(200);

                expect(body).toEqual(userLoginPayload);
            });
        });
    });
});