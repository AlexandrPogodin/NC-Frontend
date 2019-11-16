/* eslint-disable no-constant-condition */
/* eslint-disable no-use-before-define */
const readline = require('readline');
const fs = require('fs');
const path = require('path');

// DONE - create
// DONE - read
// DONE - update
// DONE - delete

class Game {
  constructor(name, developers, platforms, genres) {
    this.name = name;
    this.developers = developers.split(',');
    this.platforms = platforms.split(',');
    this.genres = genres.split(',');
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = str => new Promise(resolve => rl.question(str, resolve));

const operations = {
  readFile: async () => {
    const dirPath = path.resolve(__dirname, 'db');
    const filePath = path.resolve(dirPath, 'db.json');
    try {
      const file = fs.readFileSync(filePath, 'utf8', err => {
        if (err) throw err;
      });
      if (file) {
        const data = JSON.parse(file);
        return data;
      }
      return [];
    } catch (err) {
      throw err;
    }
  },
  saveFile: async data => {
    const dirPath = path.resolve(__dirname, 'db');
    const filePath = path.resolve(dirPath, 'db.json');
    try {
      const file = JSON.stringify(data);
      fs.writeFile(filePath, file, err => {
        if (err) throw err;
        console.log('File saved.');
      });
    } catch (err) {
      throw err;
    }
  },
  inputContent: async () => {
    console.log('Enter fields, please');
    const name = await question('Name: ');
    const developers = await question('Developers: ');
    const platforms = await question('Platforms: ');
    const genres = await question('Genres: ');
    const content = new Game(name, developers, platforms, genres);
    console.log(content);
    return content;
  },
  start: async () => {
    console.log(`
1 - Create;
2 - Read;
3 - Update;
4 - Delete.
0 - Exit
    `);
    const answer = await question('Choose an operation (1-4): ');
    if (+answer === 1) return operations.create();
    if (+answer === 2) return operations.read();
    if (+answer === 3) return operations.update();
    if (+answer === 4) return operations.delete();

    if (+answer === 0) return operations.end();
    console.error('Expected number 0-4');
    operations.start();
  },
  create: async () => {
    console.log('\n CREATE');
    const data = await operations.readFile();
    while (true) {
      const content = await operations.inputContent();
      data.push(content);
      const answer = await question('Add another game? (enter "y"): ');
      if (!(answer.startsWith('Y') || answer.startsWith('y'))) break;
    }
    await operations.saveFile(data);
    operations.start();
  },
  read: async () => {
    console.log('\n READ');
    const data = await operations.readFile();
    console.log(`Number of records: ${data.length}`);
    console.log(data);
    operations.start();
  },
  update: async () => {
    console.log('\n UPDATE');
    const data = await operations.readFile();
    const name = await question('Enter name to search: ');
    let indexOfGame;
    await data.forEach((item, i) => {
      if (item.name === name) indexOfGame = i;
    });
    if (data[indexOfGame]) {
      console.log('Game found: ', data[indexOfGame]);
      console.log('Editing...');
      const copyData = [];
      const content = await operations.inputContent();
      copyData.push(...data.slice(0, indexOfGame));
      copyData.push(content);
      copyData.push(...data.slice(indexOfGame + 1));
      await operations.saveFile(copyData);
      operations.start();
    } else {
      console.log('Game not found.');
      return operations.update();
    }
  },
  delete: async () => {
    console.log('\n DELETE');
    const data = await operations.readFile();
    const name = await question('Enter name to search: ');
    let indexOfGame;
    await data.forEach((item, i) => {
      if (item.name === name) indexOfGame = i;
    });
    if (data[indexOfGame]) {
      console.log('Game found.');
      const answer = await question(
        `Are you sure you want to delete ${data[indexOfGame].name}? (enter "y")`
      );
      if (answer.startsWith('Y') || answer.startsWith('y')) {
        const copyData = [];
        copyData.push(...data.slice(0, indexOfGame));
        copyData.push(...data.slice(indexOfGame + 1));
        await operations.saveFile(copyData);
      }
      operations.start();
    } else {
      console.log('Game not found.');
      return operations.update();
    }
  },
  end: async () => {
    rl.close();
  },
};

operations.start();
