/* eslint-disable no-loop-func */
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
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
    const filePath = path.resolve(dirPath, 'db.json');
    if (!fs.existsSync(filePath)) {
      const file = JSON.stringify([]);
      fs.writeFile(filePath, file, err => {
        if (err) throw err;
      });
    }
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
      });
    } catch (err) {
      throw err;
    }
  },
  inputContent: async () => {
    console.log('Enter fields, please');
    let isNameValid = false;
    let isDevelopersValid = false;
    let isPlatformsValid = false;
    let isGenresValid = false;

    let name;
    let developers;
    let platforms;
    let genres;
    while (!isNameValid) {
      name = await question('Name: ');
      const data = await operations.readFile();
      const indexOfGame = data.findIndex(item => item.name === name);
      if (!name) {
        console.error('ERROR: You entered an empty string!');
      } else if (indexOfGame !== -1) {
        console.error(`ERROR: Game "${name}" already exists!`);
      } else {
        isNameValid = true;
      }
    }

    while (!isDevelopersValid) {
      developers = await question('Developers: ');
      if (!developers) {
        console.error('ERROR: You entered an empty string!');
      } else {
        isDevelopersValid = true;
      }
    }

    while (!isPlatformsValid) {
      platforms = await question('Platforms: ');
      if (!platforms) {
        console.error('ERROR: You entered an empty string!');
      } else {
        isPlatformsValid = true;
      }
    }

    while (!isGenresValid) {
      genres = await question('Genres: ');
      if (!genres) {
        console.error('ERROR: You entered an empty string!');
      } else {
        isGenresValid = true;
      }
    }
    const content = new Game(name, developers, platforms, genres);
    console.log('Added game: ', content);
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
    const answer = await question('Choose an operation (0-4): ');
    answer.toLocaleLowerCase();
    if (+answer === 1 || answer.startsWith('c')) return operations.create();
    if (+answer === 2 || answer.startsWith('r')) return operations.read();
    if (+answer === 3 || answer.startsWith('u')) return operations.update();
    if (+answer === 4 || answer.startsWith('d')) return operations.delete();

    if (answer === 0) return operations.end();
    console.error('ERROR: Expected number 0-4');
    return operations.start();
  },
  create: async () => {
    console.log('\n--- CREATE ---');
    const data = await operations.readFile();
    let isUserWantsMore = true;
    while (isUserWantsMore) {
      const content = await operations.inputContent();
      data.push(content);
      const answer = await question('Add another game? (enter "y"): ');
      if (!(answer.startsWith('Y') || answer.startsWith('y'))) {
        isUserWantsMore = false;
      }
    }
    await operations.saveFile(data);
    console.log('File saved.');
    return operations.start();
  },
  read: async () => {
    console.log('\n--- READ ---');
    const data = await operations.readFile();
    console.log(`Number of records: ${data.length}`);
    console.log(data);
    return operations.start();
  },
  update: async () => {
    console.log('\n--- UPDATE ---');
    const data = await operations.readFile();
    const name = await question('Enter name to search: ');
    const indexOfGame = data.findIndex(item => item.name === name);
    if (data[indexOfGame]) {
      console.log('Game found: ', data[indexOfGame]);
      console.log('Editing...');
      const copyData = [];
      const content = await operations.inputContent();
      copyData.push(...data.slice(0, indexOfGame));
      copyData.push(content);
      copyData.push(...data.slice(indexOfGame + 1));
      await operations.saveFile(copyData);
      console.log('File updated.');
      return operations.start();
    }
    console.log('Game not found.');
    return operations.update();
  },
  delete: async () => {
    console.log('\n--- DELETE ---');
    const data = await operations.readFile();
    const name = await question('Enter name to search: ');
    const indexOfGame = data.findIndex(item => item.name === name);
    if (data[indexOfGame]) {
      console.log('Game found: ', data[indexOfGame]);
      const answer = await question(
        `Are you sure you want to delete ${data[indexOfGame].name}? (enter "y")`
      );
      if (answer.startsWith('Y') || answer.startsWith('y')) {
        const copyData = [];
        copyData.push(...data.slice(0, indexOfGame));
        copyData.push(...data.slice(indexOfGame + 1));
        await operations.saveFile(copyData);
        console.log('Game successfully deleted.');
      }
      return operations.start();
    }
    console.log('Game not found.');
    return operations.delete();
  },
  end: async () => {
    rl.close();
  },
};

operations.start();
