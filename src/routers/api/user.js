const {Router} = require('express');

const {HTTP_STATUS_CODE} = require('../../constants');

const USER_PATH = '/user';
const USER_LOGIN_PATH = `${USER_PATH}/login`;

const login = (req, res) => {
    res.status(HTTP_STATUS_CODE.CREATED).json({id: 1, mail: 'test@mail.ru'});
};

const router = Router();

router.post(USER_LOGIN_PATH, login);

module.exports = router;

