const fs = require('fs');
const path = require('path');
const { copyFile, readdir } = require('fs/promises');
const pathToDestFolder = path.join(__dirname, 'files-copy');
const pathToSrcFolder = path.join(__dirname, 'files');

async function createFolder() {
  await fs.promises.mkdir(pathToDestFolder);
  // console.log('Folder is created');
}

async function deleteFolder() {
  await fs.promises.rm(pathToDestFolder, { recursive:true, force: true });
  // console.log('Folder is deleted');
}

async function copyFilesToDestFolder() {
  try {
    const foldersList = await readdir(path.dirname(__filename));
    // console.log('foldersList:', foldersList);
    if (foldersList.includes('files-copy')) {
      await deleteFolder();
      copyFilesToDestFolder();
    } else {
      await createFolder();
      const filesList = await readdir(pathToSrcFolder);
      // console.log('filesList:', filesList);
  
      for (const file of filesList) {
        await copyFile(path.join(pathToSrcFolder, `${file}`), path.join(pathToDestFolder, `${file}`));
      }
      console.log('The files have been successfully copied to a new folder');
    }
  } catch (error) {
    console.error('error', error);
  }
}

copyFilesToDestFolder();

