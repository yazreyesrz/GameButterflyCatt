import Phaser from "phaser";
import StartScene from "../scenes/start";
import GameScene from "../scenes/game";

const config = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scene: [StartScene, GameScene],
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

const juego = new Phaser.Game(config);
console.log(juego);
