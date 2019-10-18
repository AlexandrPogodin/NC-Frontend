const cells = document.querySelectorAll('.game-cell');
const btnReset = document.querySelector('#reset-game');
const msg = document.querySelector('#msg');
const playground = document.querySelector('.game-playground');

let player = 'X';
const gameEnd = false;

function changePlayer() {
  player === 'X' ? (player = 'O') : (player = 'X');
}

function renderMsg() {
  msg.innerText = `Ходит игрок ${player}`;
}

function move(e) {
  e.target.classList.add(player);
  e.target.innerText = player;
  changePlayer();
  renderMsg();
}

playground.addEventListener('click', e => {
  if (
    e.target &&
    e.target.matches('.game-cell') &&
    !e.target.matches('.O') &&
    !e.target.matches('.X')
  ) {
    move(e);
  }
});

btnReset.addEventListener('click', e => {
  cells.forEach(cell => {
    cell.classList.remove('O');
    cell.classList.remove('X');
    cell.innerText = '';
  });
});
