const path = require('path');
const { readdir, stat } = require('fs/promises');
const pathToFolder = path.join(__dirname, 'secret-folder');

async function readFilesInfo() {
  try {
    const filesInFolder = await readdir(pathToFolder, {withFileTypes: true});

    for (const file of filesInFolder) {
      if (file.isFile()) {
        const fileGeneralStats = await stat(path.join(pathToFolder, file.name));
        const fileName = path.basename(file.name.split('.')[0]);
        const fileExtention = path.extname(file.name).slice(1);
        const fileSize = `${(fileGeneralStats.size/1024).toFixed(3)}kb`;

        console.log(`${fileName} - ${fileExtention} - ${fileSize}`);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

readFilesInfo();

