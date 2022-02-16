const {NotFoundError} = require('../errors');

const notFoundErrorHandler = (_, __, next) => next(new NotFoundError());

module.exports = notFoundErrorHandler;
