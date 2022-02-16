const fs = require('fs/promises');
const path = require('path');
const {CONFIG} = require('../constants');
const {booksRepository} = require('../repositories');

const deleteUploadedFile = async filePath =>
    await fs.rm(path.resolve(CONFIG.UPLOADS_PATH, filePath), {force: true});

const getAll = async () => await booksRepository.getAll();

const get = async (bookId) => await booksRepository.get(bookId);

const create = async (book) => await booksRepository.create(book);

const update = async (bookId, data) => {
    const book = await booksRepository.get(bookId);

    if (data.fileCover && book?.fileCover) {
        await deleteUploadedFile(book.fileCover);
    }

    if (data.fileBook && book?.fileBook) {
        await deleteUploadedFile(book.fileBook);
    }

    return await booksRepository.update(bookId, data);
};

const remove = async (bookId) => {
    const book = await booksRepository.get(bookId);

    if (book?.fileCover) {
        await deleteUploadedFile(book.fileCover);
    }

    if (book?.fileBook) {
        await deleteUploadedFile(book.fileBook);
    }

    await booksRepository.remove(bookId);

    return book;
};

module.exports = {
    getAll,
    get,
    create,
    update,
    remove,
};
