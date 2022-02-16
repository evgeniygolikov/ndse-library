const fs = require('fs/promises');

const fileExists = path =>
    fs.stat(path)
        .then(stats => stats.isFile())
        .catch(() => false);

module.exports = fileExists;
