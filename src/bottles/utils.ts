let _rndSeed = 1;

export function setRandomSeed(seed: number) {
  _rndSeed = seed * 10000;
}

export function random(to: number): number {
  const x = Math.sin(_rndSeed) * 10000;
  const rnd = x - Math.floor(x);
  _rndSeed += rnd;
  return Math.floor(rnd * to)
}

export class History<T> {
  history: any[]
  index: number;

  constructor(size: number) {
    this.index = 0;
    this.history = Array(size);
  }

  push(item: T) {
    this.index = (this.index + 1) % this.history.length;
    this.history[this.index] = item;
  }

  pop(): T {
    const item = this.history[this.index];
    this.index = (this.index - 1) % this.history.length;
    return item;
  }

}

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
