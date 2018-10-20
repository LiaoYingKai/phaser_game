var width = 288
var height = 505
var sky
var ground
var bird
var platforms
class backgroundScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'backgroundScene',
      active: true
    })
  }
  preload() {
    this.load.image('background', 'assets/background.png')
    this.load.image('ground', 'assets/ground.png')
    console.log('backgroundScene preload');
  }
  create() {
    sky = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0).setScale(1, 0.8)
    ground = this.add.tileSprite(0, height / 5 * 4, width, height / 5, 'ground').setOrigin(0, 0)

  }
  update() {
    sky.tilePositionX += 1
    ground.tilePositionX += 1
  }
}
class startGame extends Phaser.Scene {
  constructor() {
    super({
      key: 'startGame',
      active: true
    })
  }
  preload() {
    console.log('startGame preload');
    this.load.image('startButton', 'assets/start-button.png')
    this.load.image('title', 'assets/title.png')
  }
  create() {
    this.add.image(width / 2, 150, 'title')
    this.add.image(width / 2, 300, 'startButton').setInteractive().on('pointerdown', () => {
      this.scene.setVisible(true, this.scene.get('playGame'))
      this.scene.setVisible(false, this.scene.get('startGame'))
      console.log('fuck')
    })
  }
  update() {}
}
class playGame extends Phaser.Scene {
  constructor() {
    super({
      key: 'playGame',
      active: true
    })
  }
  preload() {
    console.log('playGame preload');
    this.load.spritesheet('pipes', 'assets/pipes.png', {
      frameWidth: 54,
      frameHeight: 320
    })
    this.load.spritesheet('bird', 'assets/bird.png', {
      frameWidth: 34,
      frameHeight: 24
    })

  }

  create() {
    this.scene.setVisible(false, this.scene.get('playGame'))
    this.scene.setVisible(false, this.scene.get('gameoverScene'))
    platforms = this.physics.add.staticGroup();
    platforms.create(0, 150, 'pipes').setOrigin(0, 0)
    // pipe = this.add.image(0, -150, 'pipes').setOrigin(0, 0)
    bird = this.add.sprite(50, height / 2, 'bird')
  }
  update() {
    pipe.setVelocityY(-1)
  }
}
class gameoverScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'gameoverScene',
      active: true
    })
  }
  preload() {
    console.log('gameoverScene preload');
    this.load.image('gameover', 'assets/gameover.png')
  }
  create() {
    this.add.image(0, 300, 'gameover').setOrigin(0, 0)
  }
}

var config = {
  type: Phaser.AUTO,
  width: this.width,
  height: this.height,
  scene: [backgroundScene, startGame, playGame, gameoverScene]
};

var game = new Phaser.Game(config);