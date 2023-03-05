import { NextFunction, Request, Response } from "express";
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60, maxKeys: 100 });

interface CacheResponse extends Response {
    jsonResponse?: any;
    json: any;
}

export const cacheMiddleware = (req: Request, res: CacheResponse, next: NextFunction) => {
  const cacheKey = req.originalUrl || req.url;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.send(cachedData);
  }

  res.jsonResponse = res.json;
  res.json = (body: any) => {
    cache.set(cacheKey, body);
    res.jsonResponse(body);
  };

  next();
};