const {HTTP_STATUS_CODE} = require('../constants');
const {HTTPError, InternalServerError} = require('../errors');

const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        next(err);
    }

    console.log(err);

    res.format({
        html() {
            const {code, message} = err instanceof HTTPError ? err : new InternalServerError();

            res.status(code).render('error', {title: `${code} | ${message}`});
        },
        json() {
            const {code, name, message, details} = err instanceof HTTPError ? err : new InternalServerError();

            res.status(code).json({error: {code, name, message, details}});
        },
        default() {
            res.status(HTTP_STATUS_CODE.NOT_ACCEPTABLE).send('Cервер не может вернуть ответ, соответствующий списку допустимых значений:\n- text/html\n- application/json');
        },
    });
};

module.exports = errorHandler;
