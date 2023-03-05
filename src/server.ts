import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import createServer from './utils/createServer';

const router = createServer();

/** Log colors */
const logInfo = "\x1b[36m%s\x1b[0m";
const logWarn = "\x1b[33m%s\x1b[0m";
const logError = "\x1b[31m";

/** Connect to Mongo */
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority'})
    .then(() => {
        console.log(logInfo, "connected")
        StartServer();
    })
    .catch(err => console.log(err));

const StartServer: any = () => {
    http.createServer(router)
        .listen(config.server.port, () => console.log(logInfo, `Server is running on port ${config.server.port}`));
}