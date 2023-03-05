import { NextFunction, Request, Response } from "express";
import { getSession } from "../common/sessionHandler";
import { UserRequest } from "../controllers/Users";
import { signJWT, verifyJWT } from "../utils/jwt.utils";

const deserializeUser = (req: UserRequest, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken) {
        return next();
    }
    const { payload, expired } = verifyJWT(accessToken);

    // For a valid access token
    if (payload) {
        // @ts-ignore
        req.user = payload;
        return next();
    }

    // expired but valid refresh token
    const { payload: refresh } =
        expired && refreshToken ? verifyJWT(refreshToken) : { payload: null };

    if (!refresh) {
        return next();
    }

    // @ts-ignore
    const session = getSession(refresh.sessionId);

    if (!session) {
        return next();
    }

    const newAccessToken = signJWT(session, "5s");

    res.cookie("accessToken", newAccessToken, {
        maxAge: 3.6e6, // 1 hour
        httpOnly: true,
    });

    // @ts-ignore
    req.user = verifyJWT(newAccessToken).payload;

    return next();
};

export default deserializeUser;
