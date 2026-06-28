import { createWordleGame } from './GameManager.js'
import WordManager from './WordManager.js'
import { getLetterBoxes, updateScore, updateLives, displayGameOver, updateTimer } from './UIManager.js'
import { scanWord } from './Animation.js';
import { savePlayerData } from './StorageManager.js';
import { setupInputs } from './InputManager.js';

const wordManager = new WordManager();
let game;
document.addEventListener('DOMContentLoaded', async () => {
  game = await createWordleGame(wordManager);
  setupInputs(game)
  game.getPlayer().startCountdown();
  
  const guessTemplate = document.querySelector(".letter-template").content;
  const viewContainer = document.querySelector(".view-container");

  loadGuessRows();
  loadGameData(game)
  savePlayerData(game.getPlayer());

  function loadBoard(player) {
    const currentBoard = player.getCurrentBoard();

    for (let i = 0; i < currentBoard.length; i++) {
      setRow(i, currentBoard[i]);
      scanWord(currentBoard[i], player.getWord(), i)
    }
  }

  function setRow(rowNum, word) {
    const letterBoxes = getLetterBoxes(rowNum);
    for (let i = 0; i < letterBoxes.length; i++) {
      letterBoxes[i].innerHTML += word[i];
    }
  }

  function loadGameData(game) {
    updateScore(game.getPlayer());
    updateLives(game.getPlayer());
    updateTimer(game.getPlayer());
    loadBoard(game.getPlayer());
    if (game.getPlayer().lives <= 0) {
      displayGameOver(game);
    }
  }

  function loadGuessRows() {
    for (var i = 0; i < 6; i++) {
      var template = guessTemplate.cloneNode(true)
      var temp = template.querySelector(".letter-row");
      temp.dataset.row = i + 1
      viewContainer.append(template)
    }
  }

  
});

export function getWordManager() {
  return wordManager;
}

export function getGame(){
  return game;
}


