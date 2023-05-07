const fs = require('fs');
const path = require('path');
const { unlink, writeFile, readdir } = require('fs/promises');
const pathToSrcFolder = path.join(__dirname, 'styles');
const pathToDestFolder = path.join(__dirname, 'project-dist');
const pathToMainStyleFile = path.join(__dirname, 'project-dist', 'bundle.css');

async function createFile() {
  await writeFile(
    pathToMainStyleFile,
    '',
    (error) => {
      if (error) throw error;
    }
  );
}

async function deleteFile() {
  await unlink(pathToMainStyleFile, error => {
    if(error) throw error;
  });
}

async function mergeInfo() {
  const filesInSrcFolder = await readdir(pathToSrcFolder, {withFileTypes: true});
  for (const file of filesInSrcFolder) {
    if (file.isFile() && file.name.includes('.css')) {
      const readableStream = fs.createReadStream(path.join(pathToSrcFolder, file.name));
      readableStream.on('data', data => {
        fs.appendFile(
          pathToMainStyleFile,
          `${data}\n`,
          error => {
            if (error) throw error;
          }
        );
      }); 
    }
  }
}

async function mergeCssFilesToOneFile() {
  try {
    const filesInDestFolder = await readdir(pathToDestFolder, {withFileTypes: true});

    for (const file of filesInDestFolder) {
      if (!file.name.includes('bundle.css')) {
        await createFile();
        mergeInfo();
      } else {
        await deleteFile();
        mergeInfo();
      } 
    }
    console.log('Merge process has been completed successfully');
  } catch (error) {
    console.error('error', error);
  }
}

mergeCssFilesToOneFile();
