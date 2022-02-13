const path = require('path');
const fs = require('fs/promises');
const {generateUniqueId} = require('node-unique-id-generator');

const FIXTURE_PATH = path.resolve('__fixtures__/books.json');

const store = {
    async get() {
        try {
            const buffer = await fs.readFile(FIXTURE_PATH);

            return JSON.parse(buffer.toString());
        } catch (err) {
            throw new Error('Can not read fixture file `books.json`')
        }
    },
    async set(data) {
        try {
            await fs.writeFile(FIXTURE_PATH, JSON.stringify(data, null, 4));
        } catch (err) {
            throw new Error('Can not write fixture file `books.json`')
        }
    }
};

const getAll = async () => await store.get();

const get = async (bookId) => {
    const allBooks = await store.get();

    return allBooks.find(book => book.id === bookId);
};

const create = async ({
    title = '',
    description = '',
    authors = '',
    favorite = '',
    fileCover = '',
    fileName = '',
    fileBook = '',
} = {}) => {
    const allBooks = await store.get();
    const book = {
        id: generateUniqueId(),
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
        fileBook,
    };

    await store.set([...allBooks, book]);

    return book;
};

const update = async (bookId, data = {}) => {
    const allBooks = await store.get();
    const bookIndex = allBooks.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        const book = {...allBooks[bookIndex], ...data};

        allBooks.splice(bookIndex, 1, book);

        await store.set(allBooks);

        return book;
    }
};

const remove = async (bookId) => {
    const allBooks = await store.get();
    const bookIndex = allBooks.findIndex(book => book.id === bookId);

    if (bookIndex !== -1) {
        allBooks.splice(bookIndex, 1);

        await store.set(allBooks);

        return true;
    }
};

module.exports = {
    getAll,
    get,
    create,
    update,
    remove,
};
