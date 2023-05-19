export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }
  create() {
    this.add
      .image(400, 300, "bgMenu")
      .setScale(1);
      this.add.image(400, 200, "title").setScale(1);
      this.add.image(400, 500, "playbutton").setScale(0.5).setInteractive().on("pointerdown", () => this.scene.start("Game"));}}