import {Bottle} from "./bottle";
import {lvlConfig} from "./config";
import {Bottles} from "./bottles";



export function createLvl(lvl: number): Bottles {
  const cfg = getLvlConfig(lvl);
  let colors = cfg.colors;
  if (lvl % 10 === 0) colors--;

  // todo set random seed to lvl

  return createBottles(colors, 2);
}

function getLvlConfig(lvl: number) {
  for (const cfg of lvlConfig)
    if (lvl >= cfg.lvl) return cfg;
  return lvlConfig[lvlConfig.length-1]
}


function createBottles(fullBottles: number, emptyBottles: number): Bottles {
  const totalBottles = fullBottles + emptyBottles;


  function initializeBottles(): Bottles {
    // create `fullBottles` bottles filled with same color and `emptyBottles` empty bottles
    const bottles = [];
    for (let i = 0; i < totalBottles; i++) {
      const color = (i < fullBottles) ? i + 1 : 0; // filled with same color or empty
      bottles[i] = Bottle.filled(color)
    }
    return new Bottles(bottles);
  }

  function shufleBottles(bottles: Bottles, shuffles: number) {
    // randomly pouring from one bottle to another
    for (let i = 0; i < shuffles; i++) {
      const from = bottles.getCondBottle(b => !b.isEmpty())  // find non-empty bottle
      const to = bottles.getCondBottle(b => !b.isFull() && b !== from) // find non-full bottle
      bottles.creationPour(from, to);
    }
  }

  function finalizeCreating(bottles: Bottles) {
    // pour everything from last `emptyBottles` bottles to another bottles
    for (let bi = fullBottles; bi < totalBottles; bi++) {
      const mustBeEmpyBottle = bottles.bottles[bi];
      while (!mustBeEmpyBottle.isEmpty()) {
        const to = bottles.getCondBottle((b, i) => !b.isFull() && i < fullBottles)
        bottles.creationPour(mustBeEmpyBottle, to)
      }
    }
  }



  const bottles = initializeBottles();
  shufleBottles(bottles, 500);
  finalizeCreating(bottles);
  return bottles;
}
