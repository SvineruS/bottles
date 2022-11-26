import './styles/index.css';
import './styles/game.css';
import './styles/colors.css';

import {useState} from "react";
import {Bottle, Bottles, createLvl, Pouring} from "./bottles";
import {History, sleep} from "./bottles/utils";

export function App() {
  const [lvl, setLvl] = useState(+(localStorage['lvl'] || 1));
  const [winScreen, setWinScreen] = useState(false);

  function nextLvl() {
    localStorage.setItem('lvl', (lvl + 1).toString());
    setLvl(lvl + 1);
    setWinScreen(false);
  }

  if (winScreen) return <WinScreen nextLvl={nextLvl}/>

  return <Game lvl={lvl} onWin={() => setWinScreen(true)}/>

}

function WinScreen({nextLvl}: { nextLvl: () => void }) {
  return <div className={"win"}>
    <div>Breathtaking!</div>
    <button onClick={nextLvl}>Continue!</button>
  </div>
}

function Game({lvl, onWin}: { lvl: number, onWin: () => void }) {
  const ROLLBACKS = 5;

  const [bottles, setBottles] = useState(createLvl(lvl));
  const [availableRollbacks, setAvailableRollbacks] = useState(ROLLBACKS);
  const [history, setHistory] = useState(new History<string>(ROLLBACKS));

  function reset() {
    setBottles(createLvl(lvl));
    setAvailableRollbacks(ROLLBACKS);
    setHistory(new History<string>(ROLLBACKS));
  }

  function rollback() {
    if (availableRollbacks <= 0) return;
    const prevBottles = history.pop();
    if (prevBottles === undefined) return;
    setAvailableRollbacks(availableRollbacks - 1);
    setBottles(Bottles.deserialize(prevBottles));
  }

  return <div>
    <div className={"header"}>
      <button onClick={reset}>Reset</button>
      <div className={"lvl"}>LVL: {lvl}</div>
      <button onClick={rollback}>Rollback ({availableRollbacks})</button>
    </div>
    <BottlesR bottles={bottles} savePrevState={b => history.push(b.serialize())} win={onWin}/>
  </div>

}

function BottlesR({bottles, savePrevState, win}:
                    { bottles: Bottles, savePrevState: (b: Bottles) => void, win: () => void }) {
  const [selected, setSelected] = useState(-1);

  async function pouringAnimation(pouring: Pouring) {
    // const bOut = getBottleDom(pouring.indexFrom);
    // bOut!.classList.remove("selected");
    // bOut!.classList.add("pouring");
    // await sleep(100);

    for (let i = 0; i < pouring.indexesToPour.length; i++) {
      const pOut = getColorDom(pouring.indexFrom, pouring.indexesToPour[i]);
      const pIn = getColorDom(pouring.indexTo, pouring.topIndexTo - i - 1);
      pOut!.classList.add("pour-out")
      pIn!.classList.add("pour-in")
      pIn!.classList.add(`color-${pouring.color}`)
      await sleep(100);
    }

    if (bottles.bottles[pouring.indexTo].isFilledSameNonEmptyColor())
      console.log("filled!") // todo
    if (bottles.checkWin()) {
      await sleep(300);
      win()
    }
  }

  const onClick = (i: number) => {
    if (selected === -1) setSelected(i);
    else if (selected === i) setSelected(-1);
    else {
      try {
        const pouring = bottles.pour(selected, i)
        savePrevState(bottles)
        bottles.makePour(pouring)
        pouringAnimation(pouring).then(() => setSelected(-1))
      } catch (e) {
        getBottleDom(selected)!.classList.add("shake")
        sleep(100).then(() => setSelected(-1));
      }
    }
  }

  return <div className={"bottles"}>
    {bottles.bottles.map((bottle, i) =>
      <BottleR
        key={i}
        bottle={bottle}
        onClick={() => onClick(i)}
        id={i}
        isSelected={selected === i}
      />
    )}
  </div>
}

function BottleR(props: { bottle: Bottle, onClick: () => void, isSelected: boolean, id: number }) {
  const {bottle, onClick, isSelected, id} = props;

  return <div
    className={`bottle ${isSelected ? "selected" : ''}`}
    onClick={onClick}
    id={`bottle-${id}`}
  >
    {
      bottle.colors.map((color, i) =>
        <div key={i} className={"bottleColorContainer"}>
          <div className={`bottleColor color-${color}`} id={`bottle-${id}-${i}`}></div>
        </div>
      )
    }
  </div>

}

function getBottleDom(id: number) {
  return document.getElementById(`bottle-${id}`)
}

function getColorDom(bottleId: number, colorIndex: number) {
  return document.getElementById(`bottle-${bottleId}-${colorIndex}`)
}
