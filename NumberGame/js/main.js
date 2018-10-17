class playGame extends Phaser.Scene {
  constructor() {
    super({
      key: 'playGame'
    })
  }
  preload() {

  }
  create() {

  }
  update() {

  }
}

var config = {
  width: 500,
  height: 500,
  scene: [playGame],
  backgroundColor: 0x444444
}
var game = new Phaser.Game(config)