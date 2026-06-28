import { getLetterBoxes } from './UIManager.js'

const letterBoxes = document.getElementsByClassName('keyboard-button');
const FLIP_TAG = 'letter-flip';
const SHAKE_TAG = 'letter-shake';
const ABSENT_TAG = 'absent';
const PRESENT_TAG = 'present';
const CORRECT_TAG = 'correct';

export async function scanWord(guess, correct, row) {

  const result = new Array(guess.length).fill(ABSENT_TAG);
  const target_counts = {}

  let correctLetters = 0;

  for (let i = 0; i < correct.length; i++) {
    if (guess[i] == correct[i]) {
      result[i] = CORRECT_TAG;
      correctLetters += 1;
    } else {
      target_counts[correct[i]] = (target_counts[correct[i]] || 0) + 1;
    }
    updateKeyboard(guess[i], result[i]);
  }

  for (let i = 0; i < correct.length; i++) {
    if (result[i] != ABSENT_TAG)
      continue;
    if (target_counts.hasOwnProperty(guess[i]) && target_counts[guess[i]] > 0) {
      result[i] = PRESENT_TAG
      target_counts[guess[i]] -= 1;
    }
    updateKeyboard(guess[i], result[i]);
  }

  await setColors(result, row)
  if (correctLetters == 5) {
      return true;
  }
  return false;
}

export async function setColors(result, row) {
  const promises = [];
  let boxes = getLetterBoxes(row);
  for (let i = 0; i < boxes.length; i++) {
    playCheckAnimation(boxes[i]);
    const p = new Promise(resolve => {
      setTimeout(() => {
        boxes[i].dataset.state = result[i];
        resolve();
      },250 + (i * 100))
    })
    promises.push(p);
  }

  const p = new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000)
    })
    promises.push(p);
  return Promise.all(promises);
}

function updateKeyboard(letter, form) {
  const letterBoxesArray = Array.from(letterBoxes);
  const targetLetterBox = letterBoxesArray.find(el => el.dataset.key === letter)

  if (targetLetterBox.dataset.state == CORRECT_TAG)
    return;
  if (targetLetterBox.dataset.state == PRESENT_TAG && form != CORRECT_TAG)
    return;
  targetLetterBox.dataset.state = form;
}

function playCheckAnimation(box) {
  box.classList.add(FLIP_TAG);
  setTimeout(() => {
    box.classList.remove(FLIP_TAG);
  }, 1000)    
}

export function playShakeAnimation(row) {
  row.classList.add(SHAKE_TAG);
  setTimeout(() => {
    row.classList.remove(SHAKE_TAG);
  }, 1000)
}