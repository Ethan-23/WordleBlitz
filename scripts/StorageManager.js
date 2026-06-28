import Player from './Player.js';

const STORAGE_KEY = 'playerData';

export function savePlayerData(player) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(player.toJSON()))
}

export function loadPlayer() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return new Player();
  }
  return Player.fromJSON(JSON.parse(data));
}

export function newPlayer(){
  return new Player();
}

