import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/createServer";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import { signJWT } from "../utils/jwt.utils";
import { Posts } from "../models/Posts";
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const app = createServer();
app.use(cookieParser());

const userId = new mongoose.Types.ObjectId().toString();

export const postPayload = {
    userId: userId,
    title: "Post title",
    body: "Post some body data",
    comments: [],
};

export const userPayload = {
    sessionId: "1",
    email: "test@example.com",
    name: "Jane Doe",
    userId: userId,
    role: "admin",
    valid: true
};

describe("post", () => {
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

  describe("get post route", () => {
    describe("given the post does not exist", () => {
      it("should return a 404", async () => {
        const jwt = signJWT(userPayload, '5m');

        await supertest(app).get(`/api/${userId}/posts`).set('Cookie', [`accessToken=${jwt}`]).expect(404);
      });
    });

    describe("given the post does exist", () => {
      it("should return a 200 status and the post", async () => {
        // @ts-ignore
        const post = await Posts.create(postPayload);
        const jwt = signJWT(userPayload, '5m');
        
        // @ts-ignore
        const { body, statusCode } = await supertest(app).get(`/api/${userId}/posts`).set('Cookie', [`accessToken=${jwt}`]);
        expect(statusCode).toBe(200);
            
        // @ts-ignore
        expect(body.postId).toBe(post.postId);
      });
    });
  });

  describe("create post route", () => {
    describe("given the user is not logged in", () => {
      it("should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/addPost");

        expect(statusCode).toBe(403);
      });
    });

    describe("given the user is logged in", () => {
        it("should return a 500 if user is not found", async () => {
            const jwt = signJWT(userPayload, '5m');
    
            const { statusCode, body } = await supertest(app)
                .post("/api/addPost")
                .set('Cookie', [`accessToken=${jwt}`])
                .send(postPayload);
    
            expect(statusCode).toBe(500);
        });

        it("should return a 200 and create the post if user is found", async () => {
            const jwt = signJWT(userPayload, '5m');

            const { statusCode, body } = await supertest(app)
            .post("/api/addPost")
            .set('Cookie', [`accessToken=${jwt}`])
            .send(postPayload);

            expect(statusCode).toBe(200);

            expect(body).toEqual({
                __v: 0,
                _id: expect.any(String),
                createdAt: expect.any(String),
                title: "Post title",
                body: "Post some body data",
                postId: expect.any(String),
                updatedAt: expect.any(String),
                userId: expect.any(String),
            });
        });
    });
  });
});