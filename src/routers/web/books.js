const path = require('path');
const {Router} = require('express');

const {CONFIG} = require('../../constants');
const {NotFoundError} = require('../../errors');
const {fileExists} = require('../../utils');
const {fileHandler} = require('../../middlewares');
const {booksService} = require('../../services');

const BOOKS_PATH = '/books';
const BOOK_PATH = `${BOOKS_PATH}/:id`;
const BOOK_CREATE_PATH = `${BOOKS_PATH}/create`;
const BOOK_UPDATE_PATH = `${BOOK_PATH}/update`;
const BOOK_DELETE_PATH = `${BOOK_PATH}/delete`;
const BOOK_DOWNLOAD_PATH = `${BOOK_PATH}/download`;

const ERROR_MESSAGES = {
    BOOK_NOT_FOUND: 'Книга не найдена',
};

const renderBooksPage = async (req, res, next) => {
    try {
        const books = await booksService.getAll();

        res.render('books/index', {
            title: 'Книги',
            links: [
                {title: 'Главная', href: '/'},
                {title: 'Книги', href: '/books', active: true},
            ],
            books,
        });
    } catch (err) {
        next(err);
    }
};

const renderCreateBookPage = async (req, res, next) => {
    try {
        res.render('books/create', {
            title: 'Создать книгу',
            links: [
                {title: 'Главная', href: '/'},
                {title: 'Книги', href: '/books'},
            ],
            book: {},
        });
    } catch (err) {
        next(err);
    }
};

const createBook = async (req, res, next) => {
    try {
        const {title, description, authors, favorite} = req.body;
        const fileCover = req.files?.fileCover?.[0].filename;
        const fileBook = req.files?.fileBook?.[0].filename;
        const fileName = req.files?.fileBook?.[0].originalname;
        const book = await booksService.create({
            title,
            description,
            authors,
            favorite: Boolean(favorite),
            ...fileCover && {fileCover},
            ...fileName && {fileName},
            ...fileBook && {fileBook},
        });

        res.redirect(BOOKS_PATH);
    } catch (err) {
        next(err);
    }
};

const renderUpdateBookPage = async (req, res, next) => {
    try {
        const {id} = req.params;
        const book = await booksService.get(id);

        if (!book) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK_NOT_FOUND);
        }

        res.render('books/update', {
            title: 'Редактировать книгу',
            links: [
                {title: 'Главная', href: '/'},
                {title: 'Книги', href: '/books'},
            ],
            book,
        });
    } catch (err) {
        next(err);
    }
};

const updateBook = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {title, description, authors, favorite} = req.body;
        const fileCover = req.files?.fileCover?.[0].filename;
        const fileBook = req.files?.fileBook?.[0].filename;
        const fileName = req.files?.fileBook?.[0].originalname;
        const book = await booksService.update(id, {
            title,
            description,
            authors,
            favorite: Boolean(favorite),
            ...fileCover && {fileCover},
            ...fileName && {fileName},
            ...fileBook && {fileBook},
        });

        if (!book) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK_NOT_FOUND);
        }

        res.redirect(BOOKS_PATH);
    } catch (err) {
        next(err);
    }
};

const renderBookPage = async (req, res, next) => {
    try {
        const {id} = req.params;
        const book = await booksService.get(id);

        if (!book) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK_NOT_FOUND);
        }

        res.render('books/view', {
            title: book.title,
            links: [
                {title: 'Главная', href: '/'},
                {title: 'Книги', href: '/books'},
            ],
            book,
        });
    } catch (err) {
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const {id} = req.params;
        const removedBook = await booksService.remove(id);

        if (!removedBook) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK_NOT_FOUND);
        }

        res.redirect(BOOKS_PATH);
    } catch (err) {
        next(err);
    }
};

const downloadBook = async (req, res, next) => {
    try {
        const {id} = req.params;
        const book = await booksService.get(id);

        if (!book) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK_NOT_FOUND);
        }

        const bookFilePath = path.resolve(CONFIG.UPLOADS_PATH, book.fileBook);
        const bookFileExists = await fileExists(bookFilePath);

        if (bookFileExists) {
            res.download(bookFilePath, book.fileName);
        } else {
            throw new NotFoundError(ERROR_MESSAGES.BOOK_NOT_FOUND);
        }
    } catch (err) {
        next(err);
    }
};

const router = Router();

router
    .get(BOOKS_PATH, renderBooksPage)
    .get(BOOK_CREATE_PATH, renderCreateBookPage)
    .post(
        BOOK_CREATE_PATH,
        fileHandler.fields([
            {name: 'fileCover', maxCount: 1},
            {name: 'fileBook', maxCount: 1},
        ]),
        createBook
    )
    .get(BOOK_UPDATE_PATH, renderUpdateBookPage)
    .post(
        BOOK_UPDATE_PATH,
        fileHandler.fields([
            {name: 'fileCover', maxCount: 1},
            {name: 'fileBook', maxCount: 1},
        ]),
        updateBook
    )
    .get(BOOK_PATH, renderBookPage)
    .post(BOOK_DELETE_PATH, deleteBook)
    .get(BOOK_DOWNLOAD_PATH, downloadBook);

module.exports = router;
