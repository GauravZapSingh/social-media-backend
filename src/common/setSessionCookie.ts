import { Response } from "express";
import { signJWT } from "../utils/jwt.utils";
import { createSession } from "./sessionHandler";

export const setSessionCookie = (email: string, user: any, res: Response) => {
    const session = createSession(email, user[0].name, user[0]._id, user[0].role);

    // create access token
    const accessToken = signJWT({ 
        email: user[0].email, 
        name: user[0].name, 
        userId: user[0].userId, 
        role: user[0].role, 
        sessionId: session.sessionId 
    },"5s");
    
    const refreshToken = signJWT({ 
        sessionId: session.sessionId 
    }, "1y");
    
    // set access token in cookie
    res.cookie("accessToken", accessToken, {
        maxAge: 3.6e+6, // 1 hour
        httpOnly: true,
    });
    
    res.cookie("refreshToken", refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
    });

    return session;
}