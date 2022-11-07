// node 03-files-in-folder
const path = require('path');
const fsPromises = require('fs/promises');

const getPath = (filename) => path.join(__dirname, filename);

async function getFiles(dirPath) {
    const files = await fsPromises.readdir(dirPath, {
        withFileTypes: true
    });

    for (let file of files) {
        if (file.isFile()) {
            const stats = await fsPromises.stat(path.join(dirPath, file.name));
            console.log(`${path.parse(file.name).name} - ${path.parse(file.name).ext.slice(1)} - ${stats.size / 1000}kb`);
        }
    }
}
getFiles(getPath('secret-folder'));