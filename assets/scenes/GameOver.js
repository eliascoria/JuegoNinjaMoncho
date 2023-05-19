export default class GameOver extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }
  create() {
    this.add
      .image(400, 300, "gameover")
      .setScale(3);
      this.add.image(400, 100, "menubutton").setScale(0.2).setInteractive().on("pointerdown", () => this.scene.start("Menu"));
      this.add.image(400, 500, "keyR").setScale(0.3).setInteractive().on("pointerdown", () => this.scene.start("Game"));}}