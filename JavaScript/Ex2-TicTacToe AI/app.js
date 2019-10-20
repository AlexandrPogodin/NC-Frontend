/* eslint-disable no-unused-expressions */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const cells = document.querySelectorAll('.game-cell');
const btnReset = document.querySelector('#reset-game');
const msg = document.querySelector('#msg');
const playground = document.querySelector('.game-playground');
const board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

let player = 'X';
let gameIsPlaying = true;
let isStopped = false;

function startGame() {
  cells.forEach(cell => {
    cell.classList.remove('noTouch');
  });
  gameIsPlaying = true;
  playground.classList.remove('win');
}

function endGame() {
  cells.forEach(cell => {
    cell.classList.add('noTouch');
  });
  gameIsPlaying = false;
  playground.classList.add('win');
}

function resetBoard() {
  for (let i = 0; i < board.length; i += 1) {
    board[i] = i;
  }
}

function isWinner(d, p) {
  return (
    (d[0] === p && d[1] === p && d[2] === p) ||
    (d[3] === p && d[4] === p && d[5] === p) ||
    (d[6] === p && d[7] === p && d[8] === p) ||
    (d[0] === p && d[3] === p && d[6] === p) ||
    (d[1] === p && d[4] === p && d[7] === p) ||
    (d[2] === p && d[5] === p && d[8] === p) ||
    (d[0] === p && d[4] === p && d[8] === p) ||
    (d[2] === p && d[4] === p && d[6] === p)
  );
}

function isMoves(d) {
  let res;
  d.forEach(item => {
    if (item !== 'X' && item !== 'O') res = true;
  });
  return res;
}

function changePlayer() {
  player === 'X' ? (player = 'O') : (player = 'X');
}

function renderMsg(p) {
  if (p === 'X') msg.innerText = `Ходит игрок ${p}`;
  if (p === 'O') msg.innerText = `Ходит ИИ`;
}

function renderWinMsg(p) {
  if (p === 'X') msg.innerText = `Победил игрок ${p}`;
  if (p === 'O') msg.innerText = `Победил ИИ`;
}

function renderNoMovesMsg() {
  msg.innerText = 'Ничья!';
}

function addMoveToData(cellNum, p) {
  board[cellNum] = p;
}

function getEmptyCells(b) {
  const result = [];
  b.forEach(item => {
    if (item !== 'X' && item !== 'O') result.push(item);
  });
  return result;
}

function minimax(newBoard, p) {
  const availSpots = getEmptyCells(newBoard);

  if (isWinner(newBoard, 'X')) return { score: -10 };
  if (isWinner(newBoard, 'O')) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];

  for (let i = 0; i < availSpots.length; i += 1) {
    const move = {};

    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = p;

    if (p === 'O') {
      const result = minimax(newBoard, 'X');
      move.score = result.score;
    } else {
      const result = minimax(newBoard, 'O');
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  let bestMove;
  if (p === 'O') {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i += 1) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // иначе пройти циклом по ходам и выбрать ход с наименьшим количеством очков
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i += 1) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // вернуть выбранный ход (объект) из массива ходов
  return moves[bestMove];
}

function moveAI(b) {
  const currentCell = minimax(board, player).index;
  const elem = cells[currentCell];
  elem.classList.add(player);
  elem.innerText = player;
  addMoveToData(currentCell, player);
  isStopped = false;
  if (isWinner(board, player)) {
    endGame();
    renderWinMsg(player);
  } else if (!isMoves(board)) {
    endGame();
    renderNoMovesMsg();
  } else {
    changePlayer();
    renderMsg(player);
  }
}

function doMove(e) {
  const currentCell = e.target.getAttribute('data-cell');
  e.target.classList.add(player);
  e.target.innerText = player;
  addMoveToData(currentCell, player);
  if (isWinner(board, player)) {
    endGame();
    renderWinMsg(player);
  } else if (!isMoves(board)) {
    endGame();
    renderNoMovesMsg();
  } else {
    changePlayer();
    renderMsg(player);
    isStopped = true;
    setTimeout(moveAI, 500, board);
  }
}

btnReset.addEventListener('click', e => {
  cells.forEach(cell => {
    cell.classList.remove('O');
    cell.classList.remove('X');
    cell.innerText = '';
  });
  resetBoard();
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
    !isStopped &&
    gameIsPlaying
  ) {
    doMove(e);
  }
});
