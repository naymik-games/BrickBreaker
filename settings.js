let gameOptions = {

  // ball size, compared to game width
  ballSize: 0.04,

  // ball speed, in pixels per second
  ballSpeed: 1100,

  // blocks per line, or block columns :)
  blocksPerLine: 7,

  // block lines rows
  blockLines: 10,
  //starting balls
  numBallsStart: 1,
  numLinesStart: 1,
  // max amount of blocks per line
  maxBlocksPerLine: 5,
  startingValue: 0,
  levelGoal: 300,
  // probability 0 -> 100 of having an extra ball in each line
  spawnSpecialProbability: 10,
  spawnPUProbability: 10,
  extraBallProbability: 60,
  starProbability: 60,
  specialProbability: 20,
  toggleProbability: 15,


}
let defaultClassic = { lastScore: 0, highScore: 0 }
let defaultPuzzle = { onRound: 0, rounds: [1, 0, 0, 0, 0] }
let topP = 0;
let blockCount = 0;

let blockColors = [
  0x7393B3,
  0x5F9EA0,
  0x00A36C,
  0x008080,
  0xE97451,
  0xC04000,
  0x967969,
  0x818589,
  0x7393B3,
  0x097969,
  0x5F8575,
  0x4F7942,
  0x2AAA8A,
  0xC1E1C1,
  0xCC5500,
  0xD27D2D,
  0xDE3163,
  0xC21E56,
  0xAA336A,
  0xBDB5D5,
  0xC41E3A,
  0xE30B5C
]
let bgColors = [
  0x000000,
  0x36454F,
  0x023020,
  0x28282B,
  0x353935,
  0x483248,
  0x51414F,
  0x253E28,
  0x17162F,
  0x340237,
]
// game states

const WAITING_FOR_PLAYER_INPUT = 0;
const PLAYER_IS_AIMING = 1;
const BALLS_ARE_RUNNING = 2;
const ARCADE_PHYSICS_IS_UPDATING = 3;
const PREPARING_FOR_NEXT_MOVE = 4;

gameState = WAITING_FOR_PLAYER_INPUT;

gameMode = 'normal';
let gameData = {};
let defaultData = { last: 0, best: 0, lastEasy: 0, bestEasy: 0, onRound: 0, levelStatus: [1, 0, 0] }
let round = 0;