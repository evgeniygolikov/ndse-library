const path = require('path');
const {Router} = require('express');

const {HTTP_STATUS_CODE, CONFIG} = require('../../constants');
const {NotFoundError} = require('../../errors');
const {fileExists} = require('../../utils');
const {fileHandler} = require('../../middlewares');
const {booksService} = require('../../services');

const BOOKS_PATH = '/books';
const BOOK_PATH = `${BOOKS_PATH}/:id`;
const BOOK_DOWNLOAD_PATH = `${BOOK_PATH}/download`;

const ERROR_MESSAGES = {
    BOOK: {
        NOT_FOUND: 'Книга не найдена',
    },
};

const getBooks = async (req, res, next) => {
    try {
        const books = await booksService.getAll();

        res.json({data: {books}});
    } catch (err) {
        next(err);
    }
};

const getBook = async (req, res, next) => {
    try {
        const {id} = req.params;
        const book = await booksService.get(id);

        if (!book) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK.NOT_FOUND);
        }

        res.json({data: {book}});
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
            favorite,
            ...fileCover && {fileCover},
            ...fileName && {fileName},
            ...fileBook && {fileBook},
        });

        res.status(HTTP_STATUS_CODE.CREATED).json(book);
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
            favorite,
            ...fileCover && {fileCover},
            ...fileName && {fileName},
            ...fileBook && {fileBook},
        });

        if (!book) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK.NOT_FOUND);
        }

        res.json({data: {book}});
    } catch (err) {
        next(err);
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const {id} = req.params;
        const removedBook = await booksService.remove(id);

        if (!removedBook) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK.NOT_FOUND);
        }

        res.json({data: null});
    } catch (err) {
        next(err);
    }
};

const downloadBook = async (req, res, next) => {
    try {
        const {id} = req.params;
        const book = await booksService.get(id);

        if (!book) {
            throw new NotFoundError(ERROR_MESSAGES.BOOK.NOT_FOUND);
        }

        const bookFilePath = path.resolve(CONFIG.UPLOADS_PATH, book.fileBook);
        const bookFileExists = await fileExists(bookFilePath);

        if (bookFileExists) {
            res.download(bookFilePath, book.fileName);
        } else {
            res.json({data: null});
        }
    } catch (err) {
        next(err);
    }
};

const router = Router();

router
    .get(BOOKS_PATH, getBooks)
    .get(BOOK_PATH, getBook)
    .get(BOOK_DOWNLOAD_PATH, downloadBook)
    .post(
        BOOKS_PATH,
        fileHandler.fields([
            {name: 'fileCover', maxCount: 1},
            {name: 'fileBook', maxCount: 1},
        ]),
        createBook
    )
    .put(
        BOOK_PATH,
        fileHandler.fields([
            {name: 'fileCover', maxCount: 1},
            {name: 'fileBook', maxCount: 1},
        ]),
        updateBook
    )
    .delete(BOOK_PATH, deleteBook);

module.exports = router;

