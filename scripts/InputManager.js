const pressedKeys = new Set();
const allowedKeys = new Set();

const ENTER_KEY = "enter";
const BACKSPACE = "backspace";

export function setupInputs(game) {
  initButtons(game);
  setupEvents(game);
}

let buttons = document.querySelectorAll(".keyboard-button");

function initButtons(game) {
  for (let i = 0; i < buttons.length; i++) {
    allowedKeys.add(buttons[i].getAttribute('aria-label'));
    buttons[i].addEventListener("click", function () {
      inputCheck(game, this.getAttribute('aria-label'));
    });
  }
}

function setupEvents(game) {
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (!allowedKeys.has(key))
      return;
    if (!pressedKeys.has(key)) {
      pressedKeys.add(key);
      inputCheck(game, key);
    }
  });

  document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (!allowedKeys.has(key))
      return;
    pressedKeys.delete(key);
  });
}

function checkInvalidButton(game, input) {
  return game.getWordArray().length >= 5 && input != ENTER_KEY && input != BACKSPACE
}

async function inputCheck(game, input) {
  const player = game.getPlayer();
  if (player.lives <= 0 || player.getAttempts() > 5 || checkInvalidButton(game, input)) {
    return;
  }

  if (input == ENTER_KEY) {
    game.enterWord()
  } else if (input == BACKSPACE) {
    game.removeLetter();
  } else {
    game.setLetter(input);
  }
  return;
}


