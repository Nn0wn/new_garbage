import * as express from "express"
import * as bodyParser from "body-parser"
import * as morgan from "morgan"
import * as cors from "cors"
import {logger, logger_stream} from "./winston"
import {stock_router} from "./router";

const app = express();

logger.verbose('Initialization');
declare var process: any;
logger.verbose(`Current working directory is ${process.cwd()}`);
app.use(morgan('combined', {stream: logger_stream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", cors(), stock_router);

app.listen(3000, ()=>{
    logger.verbose("HTTP server started at http://localhost:3000");
});