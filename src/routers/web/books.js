const express = require('express');
const {Router} = express;

const BOOKS_PATH = '/books';

const renderBookPage = (req, res) => {
    res.render('books/index', {
        title: 'Книги',
        links: [
            {title: 'Главная', href: '/'},
            {title: 'Книги', href: '/books', active: true},
        ]
    });
};

const router = Router();

router.get(BOOKS_PATH, renderBookPage);

module.exports = router;
