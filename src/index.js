const express = require('express');
const cors = require('cors');

const {CONFIG} = require('./constants');
const {errorHandler} = require('./middlewares');
const apiRouters = require('./routers/api');

const server = express();

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cors());

server.use('/public', express.static(`${__dirname}/public`));
server.use('/api', Object.values(apiRouters));

server.use(errorHandler);

server.listen(CONFIG.PORT);
