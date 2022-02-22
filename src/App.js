// 2022 Code challenge 1: React Hooks
// Save your solution and send the link to Gabriel
import "./styles.css";

import { useCallback, useState } from "react";

const BOARD_BORDER = "black";
const BOARD_BACKGROUND = "lightgrey";
const WORM_COLOR = "steelblue";
const WORM_BORDER = "darkblue";

export default function App() {
  const [worm, setWorm] = useState([
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 }
  ]);

  const [score, setScore] = useState(0);
  const [changingDirection, setChangingDirection] = useState(false);
  const [food, setFood] = useState({ x: 150, y: 150 });
  const [speed, setSpeed] = useState({ dx: 10, dy: 0 });

  const [wormboard, setWormboard] = useState(null);

  // Game loop
  const main = () => {
    if (hasGameEnded()) return;

    setChangingDirection(false);
    clearBoard();
    drawFood();
    moveWorm();
    drawWorm();
  };

  const clearBoard = () => {
    const wormboardContext = wormboard.getContext("2d");
    wormboardContext.fillStyle = BOARD_BACKGROUND;
    wormboardContext.strokestyle = BOARD_BORDER;
    wormboardContext.fillRect(0, 0, wormboard.width, wormboard.height);
    wormboardContext.strokeRect(0, 0, wormboard.width, wormboard.height);
  };

  const drawWorm = () => {
    worm.forEach(drawWormPart);
  };

  const drawFood = () => {
    const wormboardContext = wormboard.getContext("2d");
    wormboardContext.fillStyle = "lightgreen";
    wormboardContext.strokestyle = "darkgreen";
    wormboardContext.fillRect(food.x, food.y, 10, 10);
    wormboardContext.strokeRect(food.x, food.y, 10, 10);
  };

  const drawWormPart = (wormPart) => {
    const wormboardContext = wormboard.getContext("2d");
    wormboardContext.fillStyle = WORM_COLOR;
    wormboardContext.strokestyle = WORM_BORDER;
    wormboardContext.fillRect(wormPart.x, wormPart.y, 10, 10);
    wormboardContext.strokeRect(wormPart.x, wormPart.y, 10, 10);
  };

  const hasGameEnded = () => {
    for (let i = 4; i < worm.length; i++) {
      if (worm[i].x === worm[0].x && worm[i].y === worm[0].y) return true;
    }

    const hitLeftWall = worm[0].x < 0;
    const hitRightWall = worm[0].x > wormboard.width - 10;
    const hitToptWall = worm[0].y < 0;
    const hitBottomWall = worm[0].y > wormboard.height - 10;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
  };

  const randomLocation = (min, max) => {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
  };

  const createFood = () => {
    // Generate a random location for food to spawn
    setFood({
      x: randomLocation(0, wormboard.width - 10),
      y: randomLocation(0, wormboard.height - 10)
    });
  };

  const changeDirection = useCallback(
    (event) => {
      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;

      // Prevent the worm from reversing
      if (changingDirection) return;

      setChangingDirection(true);

      const keyPressed = event.keyCode;
      const goingUp = speed.dy === -10;
      const goingDown = speed.dy === 10;
      const goingRight = speed.dx === 10;
      const goingLeft = speed.dx === -10;

      if (keyPressed === LEFT_KEY && !goingRight) {
        setSpeed({ dx: -10, dy: 0 });
      }
      if (keyPressed === UP_KEY && !goingDown) {
        setSpeed({ dx: 0, dy: -10 });
      }
      if (keyPressed === RIGHT_KEY && !goingLeft) {
        setSpeed({ dx: 10, dy: 0 });
      }
      if (keyPressed === DOWN_KEY && !goingUp) {
        setSpeed({ dx: 0, dy: 10 });
      }
    },
    [changingDirection, speed.dx, speed.dy]
  );

  const moveWorm = () => {
    // Create the new Worm's head
    const head = { x: worm[0].x + speed.dx, y: worm[0].y + speed.dy };
    const newWorm = [head, ...worm];
    const hasEatenFood = worm[0].x === food.x && worm[0].y === food.y;
    if (hasEatenFood) {
      setScore(score + 1);
      createFood();
    } else {
      newWorm.pop();
    }

    setWorm(newWorm);
  };

  // TODO 1
  // Make use of the custom useInterval hook
  // to call the main function every 100ms

  // TODO 2
  // Use a React hook to execute the following code only once
  // on component load:
  // setWormboard(document.getElementById("wormboard"));

  // TODO 3
  // Add a custom element of your choice
  // that allows switching between a light and dark UI mode
  // making use of react hooks

  // TODO 4: Bonus quest
  // Refactor any of the above code to exist in its own custom hook

  // TODO 5: Bonus quest
  // Update the style of the game to look a bit nicer

  document.addEventListener("keydown", changeDirection);

  return (
    <div className="app">
      <h1>Sneaky sexy hungry worm</h1>
      <h3>The worm wants what the worm wants...</h3>
      <canvas
        id="wormboard"
        className="worm-board"
        width="400"
        height="400"
      ></canvas>
      <div className="score">Score: {score}</div>
    </div>
  );
}
