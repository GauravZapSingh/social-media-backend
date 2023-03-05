import express from "express";
import cors from 'cors';
import userRoutes from '../routes/Routes';
import deserializeUser from "../middleware/deserializeUser";
import cookieParser from "cookie-parser";
import { rateLimiter } from "../middleware/rateLimiter";
const contentType = require('content-type');

function createServer() {
    /** Log colors */
    const logInfo = "\x1b[36m%s\x1b[0m";
    const logWarn = "\x1b[33m%s\x1b[0m";
    const logError = "\x1b[31m";
    const app = express();

    app.use((req, res, next) => {
        /** Log the req */
        console.log(logInfo, `Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

        res.on('finish', () => {
            /** Log the res */
            console.log(logInfo, `Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`);
        });

        next();
    });

    app.use(cookieParser())
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(deserializeUser);
    app.use(rateLimiter);

    /** Rules of API */
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Content-Security-Policy', "default-src 'self'");

        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

        const contentTypeHeader = req.headers['content-type'];
        if (contentTypeHeader && contentType.parse(contentTypeHeader).type !== 'application/json') {
            return res.status(400).send('Invalid content type');
        }

        if (req.method == 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }

        next();
    });

    app.use(
        cors({
            credentials: true,
            origin: 'http://localhost:3000'
        })
    )

    /** Routes */
    app.use('/api', userRoutes);

    /** Check if server is working */
    app.get('/ping', (req, res, next) => res.status(200).json({ message: 'hello world!' }));

    /** Error handling */
    app.use((req, res, next) => {
        const error = new Error('Not found');

        console.log(logError, error);

        res.status(404).json({
            message: error.message
        });
    });

  return app;
}

export default createServer;