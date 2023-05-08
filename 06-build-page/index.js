const fs = require('fs');
const path = require('path');
const promise = require('fs/promises');

const pathToSrcCssFolder = path.join(__dirname, 'styles');
const pathToSrcAssetsFolder = path.join(__dirname, 'assets');
const pathToSrcCompFolder = path.join(__dirname, 'components');
const pathToSrcTemplate = path.join(__dirname, 'template.html');
const pathToDestFolder = path.join(__dirname, 'project-dist');
const pathToNewCssFile  = path.join(pathToDestFolder, 'style.css');
const pathToNewHtmlFile = path.join(pathToDestFolder, 'index.html');
const pathToNewAssetsFolder = path.join(pathToDestFolder, 'assets');

async function copyFolder(pathToSourceFolder, pathToDestinationFolder) {
  try {
    await promise.rm(pathToDestinationFolder, { force: true, recursive: true });
    await promise.mkdir(pathToDestinationFolder, { recursive: true });

    const filesInSrcFolder = await promise.readdir(pathToSourceFolder, { withFileTypes: true });

    for (const file of filesInSrcFolder) {
      const pathToSrcFile = path.join(pathToSourceFolder, file.name);
      const pathToNewFile = path.join(pathToDestinationFolder, file.name);

      if (file.isFile()) {
        await promise.copyFile(pathToSrcFile, pathToNewFile);
      } else if (file.isDirectory()) {
        await copyFolder(pathToSrcFile, pathToNewFile);
      }

    }
  } catch (error) {
    console.error('error', error);
  }
}

async function mergeStyle(pathToSrcFolder, pathToNewFile) {
  try {
    const writeStream = fs.createWriteStream(pathToNewFile);
    const filesInSrcFolder = await promise.readdir(pathToSrcFolder, {withFileTypes: true});

    for (const file of filesInSrcFolder) {
      if (file.isFile() && file.name.includes('.css')) {
        const curContent = await promise.readFile(path.join(pathToSrcFolder, file.name));
        writeStream.write(curContent + '\n');
      }
    }
  } catch (error) {
    console.error('error', error);
  }
}

async function buildPage() {
  try {
    await copyFolder(pathToSrcAssetsFolder, pathToNewAssetsFolder);
    console.log('"project-dist" folder has been created...');
    console.log('"assets" folder has been copied to "project-dist" folder...');

    let htmlTemplate = await promise.readFile(pathToSrcTemplate,'utf-8');
    const filesInSrcCompFolder = await promise.readdir(pathToSrcCompFolder, {withFileTypes: true});

    for (let file of filesInSrcCompFolder) {
      if (file.isFile() && file.name.includes('.html')) {
        let ComponentTitle = path.basename(file.name, '.html');
        let ComponentContent =  await promise.readFile(path.join(pathToSrcCompFolder, file.name), 'utf-8');
        htmlTemplate = htmlTemplate.replace(`{{${ComponentTitle}}}`, ComponentContent);
      }
    }

    const filesInDestFolder = await promise.readdir(pathToDestFolder);

    if (filesInDestFolder.includes('index.html')) {
      await promise.rm(pathToNewHtmlFile);
    }
    await promise.appendFile(pathToNewHtmlFile, htmlTemplate);
    console.log('"index.html" has been added to "project-dist" folder...');

    await mergeStyle(pathToSrcCssFolder, pathToNewCssFile);
    console.log('"style.css" has been added to "project-dist" folder...');
    console.log('The page has been built! Congrats!');

  } catch (error) {
    console.error('error', error);
  }
}

buildPage();
