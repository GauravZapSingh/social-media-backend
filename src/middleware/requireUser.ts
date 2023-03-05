import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../controllers/Users";

export const requireUser = (req: UserRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(403).send("Invalid session");
  }

  return next();
}