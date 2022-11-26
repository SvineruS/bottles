import {Bottle} from "./bottle";
import {BOTTLE_SIZE} from "./config";
import {random} from "./utils";

export class Bottles{
  bottles: Bottle[];

  constructor(bottles: Bottle[]) {
    this.bottles = bottles;
  }


  checkPour(from: Bottle, to: Bottle) {
    if (from.isEmpty()) throw new Error("empty bottle")
    if (to.isFull()) throw new Error("full bottle")
  }

  creationPour(from: Bottle, to: Bottle) {
    // pour one color from `from` bottle to `to` bottle without color checks
    this.checkPour(from, to);

    const topIndexFrom = from.getTopIndex();
    const topIndexTo = to.getTopIndex();

    const color = from.colors[topIndexFrom]
    from.colors[topIndexFrom] = 0
    to.colors[topIndexTo - 1] = color;
  }

  pour(indexFrom: number, indexTo: number): Pouring {
    // create `Pouring` receipt for pouring from `indexFrom` to `indexTo` bottle
    const from = this.bottles[indexFrom];
    const to = this.bottles[indexTo];

    this.checkPour(from, to);

    const topIndexFrom = from.getTopIndex();
    const topIndexTo = to.getTopIndex();

    const color = from.colors[topIndexFrom]

    if (!to.isEmpty()) {
      const toColor = to.colors[topIndexTo]
      if (toColor !== color)
        throw new Error("wrong color")
    }

    const indexesToPour = [];
    for (let i = topIndexFrom; i < BOTTLE_SIZE; i++) {
      if (from.colors[i] !== color) break;
      if (indexesToPour.length >= topIndexTo) break; // no more space
      indexesToPour.push(i)
    }

    return {indexFrom, indexTo, color, indexesToPour, topIndexTo};
  }

  makePour(pouring: Pouring) {
    // apply `Pouring`
    const from = this.bottles[pouring.indexFrom];
    const to = this.bottles[pouring.indexTo];
    pouring.indexesToPour.forEach((indexToPour, i) => {
      from.colors[indexToPour] = 0;
      to.colors[pouring.topIndexTo - i - 1] = pouring.color;
    })
  }

  checkWin(): boolean {
    for (const b of this.bottles)
      if (!b.isFilledSameColor()) return false;
    return true;
  }

  getCondBottle(cond: (bottle: Bottle, index: number) => boolean): Bottle {
    const bottles = this.bottles;
    const r = random(bottles.length);
    for (let i = 0; i < bottles.length; i++) {
      const ri = (r + i) % bottles.length;
      const bottle = bottles[ri];
      if (cond(bottle, ri)) return bottle;
    }
    throw Error("can't find bottle")
  }

  serialize(): string {
    return JSON.stringify(this)
  }

  static deserialize(s: string): Bottles {
    const parsedJson = JSON.parse(s);
    const bottles = parsedJson.bottles.map((b: any) => new Bottle(b.colors))
    return new Bottles(bottles);
  }


}


export interface Pouring {
  indexFrom: number;
  indexTo: number;
  color: number;
  indexesToPour: number[];
  topIndexTo: number;
}


