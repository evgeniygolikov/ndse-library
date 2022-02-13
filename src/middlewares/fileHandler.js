const multer = require('multer');
const {CONFIG} = require('../constants');

const storage = multer.diskStorage({
    destination(_, __, cb) {
        cb(null, CONFIG.UPLOADS_PATH);
    },
    filename(_, file, cb) {
        const date = new Date().toISOString().replace(/:/g, '-');
        const fileName = `${date}-${file.originalname}`;

        cb(null, fileName);
    },
});

const ALLOWED_COVER_TYPES = [
    'image/png',
    'image/jpg',
    'image/jpeg',
];

const ALLOWED_BOOK_TYPES = [
    'text/plain',
    'application/pdf',
];

const fileFilter = (req, file, cb) => {
    switch (file.fieldname) {
        case 'fileCover':
            cb(null, ALLOWED_COVER_TYPES.includes(file.mimetype));
            break;

        case 'fileBook':
            cb(null, ALLOWED_BOOK_TYPES.includes(file.mimetype));
            break;
    }
};

module.exports = multer({fileFilter, storage});