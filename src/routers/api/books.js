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

const getBooks = async (req, res) => {
    res.json(await booksService.getAll());
};

const getBook = async (req, res, next) => {
    const {id} = req.params;
    const book = await booksService.get(id);

    if (book) {
        res.json(book);
    } else {
        next(new NotFoundError(`Can not find a book with id: ${id}`));
    }
};

const createBook = async (req, res) => {
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
};

const updateBook = async (req, res, next) => {
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

    if (book) {
        res.json(book);
    } else {
        next(new NotFoundError(`Can not find a book with id: ${id}`));
    }
};

const deleteBook = async (req, res, next) => {
    const {id} = req.params;
    const success = await booksService.remove(id);

    if (success) {
        res.json(true);
    } else {
        next(new NotFoundError(`Can not find a book with id: ${id}`));
    }
};

const downloadBook = async (req, res, next) => {
    const {id} = req.params;
    const book = await booksService.get(id);

    if (book) {
        const bookFilePath = path.resolve(CONFIG.UPLOADS_PATH, book.fileBook);
        const bookFileExists = await fileExists(bookFilePath);

        if (bookFileExists) {
            res.download(bookFilePath, book.fileName);
        } else {
            res.json(null);
        }
    } else {
        next(new NotFoundError(`Can not find a book with id: ${id}`));
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

