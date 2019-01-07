const express = require('express');
const bodyParser = require('body-parser');
const domain = require('domain');

const sockets = require('./routes/socket');

const routes = require("./routes/routes");
const settings = require("./routes/set");
const users = require("./routes/users");
const winston = require('./logger');

const server = express();

server.use(express.static(__dirname + "/views"));
server.use('/javascripts', express.static(__dirname + "/javascripts"));
server.use('/stylesheets', express.static(__dirname + "/stylesheets"));
server.use('/lib', express.static(__dirname + "/lib"));
server.use('/data', express.static(__dirname + "/data"));

server.use((req, res, next)=>{
    const dom = domain.create();

    res.once('finish', ()=>{
        dom.exit();
        dom.removeAllListeners();
    });

    dom.once('error', function (e) {
        if (!res.headersSent) {
            let error = e && e.stack || util.inspect(e || 'no error trace available');
            winston.log({level: 'error', message: error});
            res.status(500).json({
                error: error
            });
        }
    });

    dom.run(next);

});

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/", routes);
server.use("/set", settings);
server.use("/users", users);

server.set('view engine', 'pug');
server.set('views', './views');

server.listen(3000, ()=>{
    winston.verbose('Server started at http://localhost:3000');
});
sockets.startSocketServer();