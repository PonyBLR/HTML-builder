// node 06-build-page
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const readline = require('readline');

const getPath = (filename) => path.join(__dirname, filename);

async function buildPage(inFolder, outFolder) {
    /* Make outpput dir */
    await fsPromises.mkdir(outFolder, {
        recursive: true
    });

    /* Folder Copy Function */
    const folderCopy = async (inFolder, outFolder) => {
        const files = await fsPromises.readdir(inFolder, {
            withFileTypes: true
        });
        for (let file of files) {
            if (file.isFile()) {
                await fsPromises.copyFile(path.join(inFolder, file.name), path.join(outFolder, file.name));
            } else {
                let deeperInputPath = path.join(inFolder, file.name);
                let deeperOutputPath = path.resolve(inFolder, outFolder, file.name);
                await fsPromises.mkdir(deeperOutputPath, {
                    recursive: true
                });
                folderCopy(deeperInputPath, deeperOutputPath);
            }
        }
    };
    /* Copy and bundle styles */
    const styleFiles = await fsPromises.readdir(getPath('styles'));
    const writableCssStream = fs.createWriteStream(path.join(outFolder, 'style.css'));
    for (let file of styleFiles) {
        const readableStream = fs.createReadStream(path.join(getPath('styles'), file), 'utf8');
        readableStream.on('data', data => {
            writableCssStream.write(data.toString() + '\n');
        });
    }

    /* Copy Assets */
    const outAssets = path.join(outFolder, 'assets');
    await fsPromises.mkdir(outAssets, {
        recursive: true
    });
    folderCopy(getPath('assets'), outAssets);

    /* Components Insert */
    const componentsObj = {};
    const components = await fsPromises.readdir(getPath('components'));
    for (let component of components) {
        if (path.extname(component) === '.html') {
            componentsObj[`{{${path.parse(component).name}}}`] = (await fsPromises.readFile(path.join(getPath('components'), component))).toString();
        }
    }
    const componentsObjkeys = Object.keys(componentsObj);
    const writableHtmlStream = fs.createWriteStream(path.join(outFolder, 'index.html'));
    const templateReadStream = fs.createReadStream(getPath('template.html'));
    const rl = readline.createInterface({
        input: templateReadStream,
        output: writableHtmlStream
    });
    rl.on('line', line => {
        if (new RegExp(componentsObjkeys.join("|")).test(line.trim())) {
            line = line.replace(line.trim(), componentsObj[line.trim()]);
        }
        writableHtmlStream.write(`${line}\n`);
    });
}

buildPage(__dirname, getPath('project-dist'));