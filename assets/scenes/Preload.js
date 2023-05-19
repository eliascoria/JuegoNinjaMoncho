import { SHAPES } from "../../utils.js";
const { TRIANGLE, SQUARE, DIAMOND, REDSHAPE } = SHAPES;
export default class Preload extends Phaser.Scene {
  constructor() {
    super("Preload");
  }
  preload() {
    this.load.image("sky", "./assets/image/sky.png");
    this.load.image("ground", "./assets/image/platform.png");
    this.load.image("ninja", "./assets/image/ninja.png");
    this.load.image(SQUARE, "./assets/image/square.png");
    this.load.image(TRIANGLE, "./assets/image/triangle.png");
    this.load.image(DIAMOND, "./assets/image/diamond.png");
    this.load.image(REDSHAPE, "./assets/image/redshape.png");
    this.load.image("win", "./assets/image/win.jpg");
    this.load.image("bgMenu", "./assets/image/bgMenu.jpg");
    this.load.image("gameover", "./assets/image/gameover.jpg");
    this.load.image("playbutton", "./assets/image/playbutton.png");
    this.load.image("title", "./assets/image/title.png");
    this.load.image("menubutton", "./assets/image/menubutton.png");
    this.load.audio("jumpninja", "./assets/sounds/jumpninja.wav");
    this.load.audio("collectsound", "./assets/sounds/collectsound.wav");
  }
  create() {
    this.scene.start("Menu");
  }
}