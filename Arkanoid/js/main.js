class playGame extends Phaser.Scene {
  constructor() {
    super({
      key: 'playGame'
    })
  }
  preload() {
    game.camera.setBackgroundColor('rgba(255, 0, 0, 0.5)');
  }
  create() {

  }
  update() {

  }
}

var config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  scene: [playGame]
}

var game = new Phaser.Game(config)