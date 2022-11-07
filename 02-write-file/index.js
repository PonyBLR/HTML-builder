//node 02-write-file
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const getPath = (filename) => path.join(__dirname, filename);

const writebleStream = fs.createWriteStream(getPath('text.txt'));

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.write('Hello my dear friend! Input your text below, please:\n');
rl.on('line', data => data === 'exit' ? rl.close() : writebleStream.write(`${data}\n`))
    .on('close', () => {
        rl.write('File is saved!');
        process.exit();
    });
