const express = require('express');
const cors = require('cors');

const {CONFIG} = require('./constants');
const {errorHandler, notFoundErrorHandler} = require('./middlewares');
const webRouters = require('./routers/web');
const apiRouters = require('./routers/api');

process.on('unhandledRejection', err => {
    throw err;
});
process.on('uncaughtException', err => {
    console.error(err);
    process.exit(1);
});

const server = express();

server.engine('ejs', require('express-ejs-extend'));
server.set('view engine', 'ejs');
server.set('views', CONFIG.VIEWS_PATH);

server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use(cors());

server.use('/public', express.static(CONFIG.PUBLIC_PATH, {maxAge: 10000}));
server.use('/', Object.values(webRouters));
server.use('/api', Object.values(apiRouters));

server.use(notFoundErrorHandler);
server.use(errorHandler);

server.listen(CONFIG.PORT);
