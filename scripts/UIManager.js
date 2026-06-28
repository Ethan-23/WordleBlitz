const letterBoxes = document.getElementsByClassName('keyboard-button');
const scoreLabel = document.getElementsByClassName('score-label');
const lifeLabel = document.getElementsByClassName('life-label');
const timerLabel = document.getElementsByClassName('timer-label');

const guessTemplate = document.querySelector(".game-over-template").content;
const viewContainer = document.querySelector(".view-container");

const HEART_EMOJI = "\u2764\uFE0F";

export function getLetterBoxes(row) {
  const guessRow = document.querySelectorAll('[data-row]');
  let letterBoxes = guessRow[row].querySelectorAll('[data-state]');
  return letterBoxes
}

export function resetBoard() {
  for (let i = 0; i < 6; i++) {
    const letterBoxes = getLetterBoxes(i);
    for (let j = 0; j < letterBoxes.length; j++) {
      letterBoxes[j].innerHTML = '';
      letterBoxes[j].dataset.state = 'empty';
    }
  }
}

export function resetKeyboard() {
  const letterBoxesArray = Array.from(letterBoxes);
  for (let i = 0; i < letterBoxesArray.length; i++) {
    letterBoxesArray[i].removeAttribute('data-state');
  }
}

export function updateScore(player) {
  scoreLabel[0].innerHTML = 'Score: ' + player.getScore();
}

export function updateLives(player) {
  lifeLabel[0].innerHTML = HEART_EMOJI.repeat(player.getLives());
}

export function updateTimer(player){
  timerLabel[0].innerHTML = player.getTimer();
}

export function displayGameOver(game) {

  var template = guessTemplate.cloneNode(true);
  viewContainer.append(template);
  const playAgainButton = document.querySelector(".game-over-button");
  playAgainButton.addEventListener("click", function () {
    game.resetGame();
  });

}

export function removeGameOver() {
  const guessTemplate = document.querySelector(".game-over-container").remove();
}