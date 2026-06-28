import { getWordManager, getGame } from "./Load.js";
import { savePlayerData } from "./StorageManager.js";
import { updateLives, updateScore, updateTimer, displayGameOver } from "./UIManager.js";

const TIMER = 30;

class Player {
  constructor(lives = 3, score = 0, guessedWords = [], attempts=0, currentBoard = [], currentWord = getWordManager().generateWord(), timer = TIMER) {
    this.lives = lives;
    this.score = score;
    this.timer = timer;
    this.timerTask = null;
    this.guessedWords = new Set(guessedWords);
    this.attempts = attempts;
    this.currentBoard = currentBoard;
    this.currentWord = currentWord;
  }

  generateNewWord(){
    this.currentWord = getWordManager().generateWord();
    this.getGuessedWords().delete(this.currentWord);
    savePlayerData(this);
  }

  removeLife(amount) {
    this.lives -= amount;
    updateLives(this);
    if (this.getLives() == 0) {
      displayGameOver(getGame());
    }
    savePlayerData(this);
  }

  addLife(amount) {
    this.lives += amount;
    updateLives(this);
  }

  getLives(){
    return this.lives;
  }

  removeScore(amount) {
    this.score -= amount;
    updateScore(this);
  }

  addScore(amount) {
    this.score += amount;
    updateScore(this);
  }

  getScore(){
    return this.score;
  }

  addGuessedWord(word){
    this.guessedWords.add(word);
  }

  removeGuessedWord(word){
    this.guessedWords.delete(word);
  }

  addAttempt(){
    this.attempts++;
  }

  getAttempts(){
    return this.attempts;
  }

  resetAttempts(){
    this.attempts = 0;
  }

  addCurrentBoard(word){
    this.currentBoard.push(word);
  }

  getCurrentBoard(){
    return this.currentBoard;
  }

  clearCurrentBoard(){
    this.currentBoard = [];
  }

  setWord(word){
    this.currentWord = word;
  }

  getWord(){
    return this.currentWord;
  }

  resetCurrentBoard(){
    this.currentBoard = []
  }

  getGuessedWords(){
    return this.guessedWords;
  }

  getTimer(){
    return this.timer;
  }

  //Correct Double countdown timer
  //Save and cancel task id to game save
  startCountdown(){
    if (this.countdownTask != null) return;
    this.timerTask = setTimeout(() => {
      if(this.timer > 0) this.timer--;
        savePlayerData(this);
        updateTimer(this);
        if(this.timer <= 0){
          this.stopCountdown()
          this.removeLife(1);
          if(this.getLives() >= 1) getGame().resetRound();
          return;
        }else{
          this.startCountdown();
        }
      },1000)
  }

  stopCountdown(){
    if(this.timerTask != null){
      clearTimeout(this.timerTask)
    }
  }

  toJSON(){
    return{
      lives: this.lives,
      score: this.score,
      guessedWords: [...this.guessedWords],
      attempts: this.attempts,
      currentBoard: this.currentBoard,
      currentWord: this.currentWord,
      timer: this.timer
    };
  }

  static fromJSON(data){
    return new Player(data.lives, data.score, new Set(data.guessedWords), data.attempts, data.currentBoard, data.currentWord, data.timer);
  }
}

export default Player;