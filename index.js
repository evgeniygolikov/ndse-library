const express = require('express');
const formData = require('express-form-data');
const cors = require('cors');

const {Book} = require('./src/models');

const store = {
    books: [],
};

Array.from({length: 10}, (_, index) => {
    store.books.push(new Book({
        title: `Заголовок ${index}`,
        description: `Описание ${index}`,
        authors: `А.С. Пушкин, Л.Н. Толстой`,
    }));
});

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(formData.parse());
app.use(cors());

app.post('/api/user/login', (_, res) => {
    res.status(201).json({
        id: 1,
        mail: 'test@mail.ru',
    });
});

app.get('/api/books', (req, res) => {
    res.json(store.books);
});

app.get('/api/books/:id', (req,res) => {
    const book = store.books.find(book => book.id === req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json('book | not_found');
    }
});

app.post('/api/books', (req, res) => {
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body;
    const book = new Book({
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    });

    store.books.push(book);

    res.status(201).json(book);
});

app.put('/api/books/:id', (req, res) => {
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body;
    const book = store.books.find(book => book.id === req.params.id);

    if (book) {
        Object.assign(book, {
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
        });
        res.json(book);
    } else {
        res.status(404).json('book | not_found');
    }
});

app.delete('/api/books/:id', (req, res) => {
    const bookIndex = store.books.findIndex(book => book.id === req.params.id);

    if (bookIndex !== -1) {
        store.books.splice(bookIndex, 1);
        res.json('ok');
    } else {
        res.status(404).json('book | not_found');
    }
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Server is running, go to http://localhost:${PORT}`)
});