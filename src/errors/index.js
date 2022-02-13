const {HTTP_STATUS_CODE} = require('../constants');

class NotFoundError extends Error {
    constructor(message = '') {
        super(message);

        this.code = HTTP_STATUS_CODE.NOT_FOUND;
    }
}

class InternalServerError extends Error {
    constructor(message = '') {
        super(message);

        this.code = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    }
}

module.exports = {
    NotFoundError,
    InternalServerError,
};
