/* eslint-disable no-unused-expressions */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const cells = document.querySelectorAll('.game-cell');
const btnReset = document.querySelector('#reset-game');
const msg = document.querySelector('#msg');
const playground = document.querySelector('.game-playground');
const dataOfPlayground = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
};

let player = 'X';
let gameIsPlaying = true;

function startGame() {
  gameIsPlaying = true;
  playground.classList.remove('win');
}

function endGame() {
  gameIsPlaying = false;
  playground.classList.add('win');
}

function resetPlayground() {
  for (const cell in dataOfPlayground) {
    dataOfPlayground[cell] = '';
  }
}

function isWinner(d, p) {
  return (
    (d[1] === p && d[2] === p && d[3] === p) ||
    (d[4] === p && d[5] === p && d[6] === p) ||
    (d[7] === p && d[8] === p && d[9] === p) ||
    (d[1] === p && d[4] === p && d[7] === p) ||
    (d[2] === p && d[5] === p && d[8] === p) ||
    (d[3] === p && d[6] === p && d[9] === p) ||
    (d[1] === p && d[5] === p && d[9] === p) ||
    (d[3] === p && d[5] === p && d[7] === p)
  );
}

function isMoves(d) {
  for (const cell in d) {
    if (d[cell] === '') return true;
  }
}

function changePlayer() {
  player === 'X' ? (player = 'O') : (player = 'X');
}

function renderMsg(p) {
  msg.innerText = `Ходит игрок ${p}`;
}

function renderWinMsg(p) {
  msg.innerText = `Победил игрок ${p}`;
}

function renderNoMovesMsg() {
  msg.innerText = 'Ничья!';
}

function addMoveToData(cellNum, p) {
  dataOfPlayground[cellNum] = p;
}

function move(e) {
  const currentCell = e.target.getAttribute('data-cell');
  e.target.classList.add(player);
  e.target.innerText = player;
  addMoveToData(currentCell, player);
  console.log('PG: ', dataOfPlayground);
  if (isWinner(dataOfPlayground, player)) {
    endGame();
    renderWinMsg(player);
  } else if (!isMoves(dataOfPlayground)) {
    endGame();
    renderNoMovesMsg();
  } else {
    changePlayer();
    renderMsg(player);
  }
}

btnReset.addEventListener('click', e => {
  cells.forEach(cell => {
    cell.classList.remove('O');
    cell.classList.remove('X');
    cell.innerText = '';
  });
  resetPlayground();
  startGame();
  player = 'X';
  renderMsg(player);
});

playground.addEventListener('click', e => {
  if (
    e.target &&
    e.target.matches('.game-cell') &&
    !e.target.matches('.O') &&
    !e.target.matches('.X') &&
    gameIsPlaying
  ) {
    move(e);
  }
});
