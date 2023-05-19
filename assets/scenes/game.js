import {
  SHAPES,
  POINTS_PERCENTAGE,
  POINTS_PERCENTAGE_VALUE_START,
} from "../../utils.js";
const { TRIANGLE, SQUARE, DIAMOND, REDSHAPE } = SHAPES;
export default class Game extends Phaser.Scene {
  score;
  gameOver;
  timer;
  jumpninja;
  collectsound;
  constructor() {
    super("Game");
  }

  init() {
    this.gameOver = false;
    this.shapesRecolected = {
      [TRIANGLE]: { count: 0, score: 10 },
      [SQUARE]: { count: 0, score: 20 },
      [DIAMOND]: { count: 0, score: 30 },
      [REDSHAPE]: { count: 0, score: -10 },
    };
    console.log(this.shapesRecolected);
  }
  preload() {
    this.load.image("sky", "./assets/image/sky.png");
    this.load.image("ground", "./assets/image/platform.png");
    this.load.image("ninja", "./assets/image/ninja.png");
    this.load.image("keyR", "./assets/image/keyR.png");
    this.load.image(SQUARE, "./assets/image/square.png");
    this.load.image(TRIANGLE, "./assets/image/triangle.png");
    this.load.image(DIAMOND, "./assets/image/diamond.png");
    this.load.image(REDSHAPE, "./assets/image/redshape.png");
    this.load.image("win", "./assets/image/win.jpg");
    this.load.image("bgMenu", "./assets/image/bgMenu.jpg");
  }
  create() {
   //add sound
   this.soundJump = this.sound.add("jumpninja").setVolume(0.2);
   this.soundCollect = this.sound.add("collectsound");
    //add background
    this.add.image(400, 300, "sky").setScale(0.555);

    //add static platforms group
    let platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, "ground").setScale(2).refreshBody();
    //otra plataforma
    let platforms2 = this.physics.add.staticGroup();
    platforms2.create(75, 350, "ground").setScale(0.75).refreshBody();
    //add shapes group
    this.shapesGroup = this.physics.add.group();
    // this.shapesGroup.create(100, 0, "diamond");
    // this.shapesGroup.create(200, 0, "triangle");
    // this.shapesGroup.create(300, 0, "square");

    //add sprites player
    this.player = this.physics.add.sprite(100, 450, "ninja");
    this.player.setCollideWorldBounds(true);

    //create cursors
    this.cursors = this.input.keyboard.createCursorKeys();
    //add collider between player and platforms
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.player, this.shapesGroup);
    this.physics.add.collider(platforms, this.shapesGroup);
    this.physics.add.collider(platforms2, this.shapesGroup);
    this.physics.add.collider(this.player, platforms2);

    //create event to add shapes
    this.time.addEvent({
      delay: 3000,
      callback: this.addShape,
      callbackScope: this,
      loop: true,
    });

    //add overlap between player and shapes
    this.physics.add.overlap(
      this.player,
      this.shapesGroup,
      this.collectShape,
      null,
      this
    );
    this.physics.add.overlap(
      this.shapesGroup,
      platforms,
      this.reduce,
      null,
      this
    );
    this.physics.add.overlap(
      this.shapesGroup,
      platforms2,
      this.reduce,
      null,
      this
    );
    //add score on scene
    this.score = 0;
    this.scoreText = this.add.text(20, 20, "Score:" + this.score, {
      fontsize: "32px",
      fontstyle: "bold",
      fill: "#FFFFFF",
    });

    // add timer
    this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this,
      loop: true,
    });
    this.timer = 30;
    this.timerText = this.add.text(750, 20, this.timer, {
      fontsize: "32px",
      fontstyle: "bold",
      fill: "#FFFFFF",
    });
  }
  update() {
    if (this.score > 100) {
      this.scene.start("Win");
    }
    if (this.gameOver) {
      this.scene.start("GameOver");
    }
    //update player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-250);
    } else {
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(250);
      } else {
        this.player.setVelocityX(0);
      }
    }
    //update player jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
      this.soundJump.play();
    }
  }

  addShape() {
    //get random shape
    const randomShape = Phaser.Math.RND.pick([
      DIAMOND,
      SQUARE,
      TRIANGLE,
      REDSHAPE,
    ]);
    //get random position x
    const randomX = Phaser.Math.RND.between(0, 800);
    //add shape to screen
    this.shapesGroup
      .create(randomX, 0, randomShape)
      .setCircle(32, 0, 0)
      .setBounce(0.8)
      .setData(POINTS_PERCENTAGE, POINTS_PERCENTAGE_VALUE_START);
    console.log("shape is added", randomX, randomShape);
  }
  collectShape(player, shape) {
    shape.disableBody(true, true);
    const shapeName = shape.texture.key;
    const percentage = shape.getData(POINTS_PERCENTAGE);
    const scoreNow = this.shapesRecolected[shapeName].score * percentage;
    this.score += scoreNow;
    this.scoreText.setText(`Score: ${this.score.toString()}`);
    this.shapesRecolected[shapeName].count++;
    this.soundCollect.play();
    //condition to win
    if (this.shapesRecolected[shapeName].count === 3) {
      this.scene.start("Win");
    }
  }

  onSecond() {
    this.timer--;
    this.timerText.setText(this.timer);
    if (this.timer <= 0) {
      this.gameOver = true;
    }
  }
  reduce(shape, platforms) {
    const newPercentage = shape.getData(POINTS_PERCENTAGE) - 0.25;
    console.log(shape.texture.key, newPercentage);
    shape.setData(POINTS_PERCENTAGE, newPercentage);
    if (newPercentage <= 0) {
      shape.disableBody(true, true);
      return;
    }

    // show text
    const text = this.add.text(
      shape.body.position.x + 10,
      shape.body.position.y,
      "- 25%",
      {
        fontSize: "22px",
        fontStyle: "bold",
        fill: "red",
      }
    );
    setTimeout(() => {
      text.destroy();
    }, 200);
  }
}
