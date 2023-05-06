const fs = require('fs');
const path = require('path');
const { stdin, stdout, stderr } = process;
const linkToFile = path.join(__dirname, 'text.txt');
const byeText = 'Thank you for your time! Goodbye. \n';

fs.writeFile(
  linkToFile,
  '',
  (error) => {
    if (error) throw error;
  }
);

stdout.write('Hello! Please insert your text...\n(For exit: type "exit" or press Ctrl+C.)\n');

stdin.on('data', data => {
  const dataString = data.toString();
  // to exit via .exit + enter
  if (dataString === 'exit\r\n' || dataString === 'exit\n') {
    stdout.write(byeText);
    process.exit();
  } else {
    fs.appendFile(
      linkToFile,
      `${dataString}`,
      (error) => {
        if (error) throw error;
      }
    );
  }
});

// to exit via .Ctrl + C
process.on('SIGINT', () => {
  stdout.write(byeText);
  process.exit();
});

process.on('error', (error)=> stderr.write(`Oops! It seems to be an error: ${error.text}\n Please try one more time.\n`));
