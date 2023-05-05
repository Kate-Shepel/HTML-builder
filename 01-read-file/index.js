const fs = require('fs');
const path = require('path');

const linkToFile = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(linkToFile, 'utf-8');
readableStream.on('data', chunk => console.log(chunk));
