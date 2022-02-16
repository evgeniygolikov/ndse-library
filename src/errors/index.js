const {HTTP_STATUS_CODE} = require('../constants');

class HTTPError extends Error {
    constructor(message) {
        super(message);

        Error.captureStackTrace(this);
    }

    get name() {
        return this.constructor.name;
    }

    set name(_) {
        throw new Error('Cannot change value of http error name')
    }
}

class NotFoundError extends HTTPError {
    constructor(message = 'Ничего не найдено') {
        super(message);

        this.code = HTTP_STATUS_CODE.NOT_FOUND;
    }
}

class InternalServerError extends HTTPError {
    constructor(message = 'Ошибка сервера') {
        super(message);

        this.code = HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR;
    }
}

module.exports = {
    HTTPError,
    NotFoundError,
    InternalServerError,
};
