import {BOTTLE_SIZE} from "./config";


export class Bottle {
  colors: number[];

  constructor(colors: number[]) {
    this.colors = colors;
  }

  static filled(color: number) {
    const colors = [];
    for (let i = 0; i < BOTTLE_SIZE; i++) colors[i] = color;
    return new Bottle(colors);
  }

  getTopIndex() {
    for (let i = 0; i < this.colors.length; i++)
      if (this.colors[i] !== 0)
        return i
    return this.colors.length;
  }

  isEmpty() {
    return this.colors[this.colors.length - 1] === 0;
  }

  isFull() {
    return this.colors[0] !== 0;
  }

  isFilledSameColor() {
    for (const c of this.colors)
      if (c !== this.colors[0]) return false;
    return true;
  }

  isFilledSameNonEmptyColor() {
    for (const c of this.colors)
      if (c !== this.colors[0]) return false;
    return this.colors[0] !== 0;
  }

}
