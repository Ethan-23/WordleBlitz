import { scanWord, playShakeAnimation } from "./Animation.js";
import { resetKeyboard, resetBoard, updateLives, updateScore, getLetterBoxes, removeGameOver, displayGameOver } from './UIManager.js'
import { loadPlayer, savePlayerData, newPlayer } from './StorageManager.js'
import { getWordManager } from './Load.js'

const MAX_SCORE = 60;
const SCORE_MULTI = 10;
const TIMER = 30;
const FILLED = 'filled';
const EMPTY = 'empty';
const DATA_ROW = '[data-row]'

class WordleGame {

  constructor() {
    this.player = loadPlayer(),
      this.letterCount = 0,
      this.wordArray = [],
      this.checking = false;
  }

  getPlayer() {
    return this.player;
  }

  getWordArray() {
    return this.wordArray;
  }

  isValidWord(word) {
    return this.wordSet.has(word);
  }

  resetGame() {
    resetBoard(this.player);
    this.player = newPlayer();
    this.resetRound();
    removeGameOver();
  }

  resetRound() {
    this.wordArray = [];
    this.letterCount = 0;
    this.checking = false;
    this.player.generateNewWord();
    this.player.resetAttempts();
    resetBoard(this.player);
    this.player.resetCurrentBoard();
    this.player.timer = TIMER;
    this.player.startCountdown();
    savePlayerData(this.player);
    updateLives(this.player);
    updateScore(this.player);
    resetKeyboard();
  }

  setLetter(letter) {
    if (this.wordArray.length >= 5 || this.checking) return;
    const letterBox = getLetterBoxes(this.player.getAttempts())[this.letterCount];
    this.letterCount++;
    this.wordArray.push(letter);
    letterBox.dataset.state = FILLED
    letterBox.innerHTML = letter
  }

  removeLetter() {
    if (this.wordArray.length == 0 || this.checking) return;
    this.letterCount--;
    this.wordArray.pop();
    const letterBox = getLetterBoxes(this.player.getAttempts())[this.letterCount];
    letterBox.dataset.state = EMPTY
    letterBox.innerHTML = ""
  }

  async enterWord() {
    if (this.wordArray.length != 5) return;

    const guessWord = this.wordArray.join('');

    if (!getWordManager().isValidWord(guessWord) || this.player.getGuessedWords().has(guessWord)) {
      playShakeAnimation(document.querySelectorAll(DATA_ROW)[this.player.getAttempts()])
      return;
    }

    this.checking = true;

    if (await this.checkWord(guessWord) == true) {
      savePlayerData(this.player);
      return;
    }

    this.nextGuess();
    this.checkAttempts();
    savePlayerData(this.player);
    return;
  }

  nextGuess() {
    this.player.addAttempt()
    this.letterCount = 0;
    this.wordArray = []
    this.checking = false;
  }

  checkAttempts() {
    if (this.player.getAttempts() != 6) return;
    this.player.removeLife(1);
    this.resetRound()
  }

  async checkWord(guessWord) {
    let correct = await scanWord(guessWord, this.player.getWord(), this.player.getAttempts())
    this.player.addCurrentBoard(guessWord);
    this.player.addGuessedWord(guessWord);

    if (correct == true) {
      this.player.addScore(MAX_SCORE - this.player.getAttempts() * SCORE_MULTI);
      this.resetRound();
      resetKeyboard();
    }
    return correct;
  }

  
}



export async function createWordleGame(wordManager) {
  await wordManager.generateWords();
  return new WordleGame();
}



