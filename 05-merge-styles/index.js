// node 05-merge-styles
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const getPath = (filename) => path.join(__dirname, filename);
const writableStream = fs.createWriteStream(getPath('project-dist/bundle.css'));

async function mergeStyles(dirPath) {
    const files = await fsPromises.readdir(dirPath);
    for (let file of files) {
        if (path.extname(file) === '.css') {
            const readableStream = fs.createReadStream(path.join(getPath('styles'), file), 'utf8');
            readableStream.on('data', data => {
                writableStream.write(data.toString() + '\n');
            });
        }

    }
}
mergeStyles(getPath('styles'));