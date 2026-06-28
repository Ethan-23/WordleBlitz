export default class WordManager {
  constructor() {
    this.wordList = [],
      this.wordSet = new Set();
  }

  generateWord() {
    return this.wordList[Math.floor(Math.random() * this.wordList.length)];
  }
  isValidWord(word) {
    return this.wordSet.has(word);
  }
  async generateWords() {
    try {
      const response = await fetch('./wordbank/solutions.txt');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      this.wordList = text.split(/\r?\n/).filter(line => line.trim() !== '');
      this.wordSet = new Set(this.wordList);

    } catch (error) {
      console.error('Error fetching the text file:', error);
      this.wordSet = new Set();
    }
  }
}
