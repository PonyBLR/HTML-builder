// node 04-copy-directory
const path = require('path');
const fsPromises = require('fs/promises');

const getPath = (filename) => path.join(__dirname, filename);

async function copyDir(newDir, dirPath) {
    await fsPromises.rm(newDir, {
        recursive: true,
        force: true
    });
    await fsPromises.mkdir(newDir, {
        recursive: true
    });
    const files = await fsPromises.readdir(dirPath);
    for (let file of files) {
        await fsPromises.copyFile(path.join(dirPath, file), path.join(newDir, file));
    }
}
copyDir(getPath('files-copy'), getPath('files'));