// node 01-read-file
const fs = require('fs');
const path = require('path');

const getPath = (filename) => path.join(__dirname, filename);

const {
    stdout
} = process;
const stream = fs.createReadStream(getPath('text.txt'), 'utf8');
stream.on('data', (chunk) => stdout.write(chunk));