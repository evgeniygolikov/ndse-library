const express = require('express');
const {Router} = express;

const INDEX_PATH = '/';

const renderIndexPage = (req, res) => {
    res.render('index', {
        title: 'Главная',
        links: [
            {title: 'Главная', href: '/', active: true},
            {title: 'Книги', href: '/books'},
        ]
    });
};

const router = Router();

router.get(INDEX_PATH, renderIndexPage);

module.exports = router;
