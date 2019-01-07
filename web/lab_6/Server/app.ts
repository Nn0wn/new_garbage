declare function require(name:string): any;
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const http = require("http");
import {logger, logger_stream} from "./winston"
import {stock_router, market} from "./stocks_router";
import {SocketController} from './socket_controller';



logger.verbose('Initialization');
declare var process: any;
logger.verbose(`Current working directory is ${process.cwd()}`);
const app = express();
const server = http.createServer(app);
new SocketController(server, market);
app.use(morgan('combined', {stream: logger_stream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", cors(), stock_router);

server.listen(process.env.PORT || 3100, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  logger.verbose(`Server listening at ${addr.address}:${addr.port}`);
});