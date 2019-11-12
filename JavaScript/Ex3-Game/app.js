/* eslint-disable no-use-before-define */
class Entity {
  constructor(position) {
    this.position = position;

    entityList.push(this);
    this.updatePos();
    renderPlayground();
  }

  updatePos() {
    playground[this.position[1]][this.position[0]] = this.render();
  }
}

class Character extends Entity {
  constructor(speed, position) {
    super(position);
    this.speed = speed;
    this.score = 0;
  }

  moveUp() {
    if (this.position[1] > -1 + this.speed) {
      updateEntityList(this, this.position[0], this.position[1] - this.speed);
      this.position[1] -= this.speed;
    }
    updatePlayground();
  }

  moveDown() {
    if (this.position[1] < 10 - this.speed) {
      updateEntityList(this, this.position[0], this.position[1] + this.speed);
      this.position[1] += this.speed;
    }
    updatePlayground();
  }

  moveRight() {
    if (this.position[0] < 10 - this.speed) {
      updateEntityList(this, this.position[0] + this.speed, this.position[1]);
      this.position[0] += this.speed;
    }
    updatePlayground();
  }

  moveLeft() {
    if (this.position[0] > -1 + this.speed) {
      updateEntityList(this, this.position[0] - this.speed, this.position[1]);
      this.position[0] -= this.speed;
    }
    updatePlayground();
  }
}

class Food extends Entity {
  render() {
    return '🍲';
  }
}

class Rat extends Character {
  constructor(position) {
    super(2, position);
  }

  render() {
    return '🐀';
  }
}

class Cat extends Character {
  constructor(position) {
    super(1, position);
  }

  render() {
    return '🐈';
  }
}

const $app = document.querySelector('.app');
const playground = [];
const entityList = [];
function randomInt(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function createPlayground() {
  for (let i = 0; i < 10; i += 1) {
    playground[i] = [];
    for (let j = 0; j < 10; j += 1) {
      playground[i][j] = '';
    }
  }
}

function renderPlayground() {
  const $playground = document.createElement('div');
  const $btnUpdate = document.createElement('button');
  $playground.classList.add('playground');
  $btnUpdate.classList.add('btn-update');
  $btnUpdate.innerHTML = 'Обновить поле';
  $app.innerHTML = '';
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.innerHTML = playground[i][j];
      $playground.appendChild(cell);
    }
  }

  $app.appendChild($playground);
  $app.appendChild($btnUpdate);
}

function updatePlayground() {
  createPlayground();
  entityList.forEach(obj => {
    obj.updatePos();
  });
  renderPlayground();
}

function updateEntityList(obj, x, y) {
  if (playground[y][x] === '🍲') obj.score += 1;
  const newEntityList = entityList.filter(entity => {
    if (entity.position[0] === x && entity.position[1] === y) {
      return false;
    }
    return true;
  });
  entityList.length = 0;
  entityList.push(...newEntityList);
}

$app.addEventListener('click', e => {
  if (e.target && e.target.matches('.btn-update')) {
    updatePlayground();
  }
});

createPlayground();
renderPlayground();

const food = new Food([0, 3]);
const cat = new Cat([0, 2]);
