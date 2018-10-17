var width = 288
var height = 505
var test
class backgroundScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'backgroundScene',
      active: true
    })
  }
  preload() {
    console.log('backgroundScene preload');
    this.load.image('background', 'assets/background.png')
    this.load.image('ground', 'assets/ground.png')

  }
  create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0).setScale(1, 0.8)
    test = this.add.image(0, height / 5 * 4, 'ground').setOrigin(0, 0)
  }
  update() {
    // this.tilePosition.x -= -1
    test.setVelocityX(-1)
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
  update() {

  }
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
    this.load.spritesheet('bird', 'assets/bird.png', {
      frameWidth: 60,
      frameHeight: 60
    })
  }
  create() {
    // var config = {
    //   key: 'birds',
    //   frames: this.anims.generateFrameNumbers('bird', {
    //     start: 0,
    //     end: 2
    //   }),
    //   repeat: -1,
    //   frameRate: 15
    // }
    // this.anims.create(config)
    // this.bird = this.add.sprite(50, height / 2, 'bird')
    // this.bird.anims.play('birds')
    // this.add.image(50, height / 2, 'bird')
    this.scene.setVisible(false, this.scene.get('playGame'))
    this.scene.setVisible(false, this.scene.get('gameoverScene'))
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
    // this.scene.bringToTop()
    // this.scene.setVisible(false, this.scene.get('startGame'))
  }
}
// var playGame = new Phaser.Class({
//   extends: Phaser.Scene,
//   preload: function() {
//     console.log('场景 2 preload');
//     this.load.image('background', 'assets/background.png')
//   },
//   create: function() {
//     this.add.image(0, 0, 'background').setOrigin(0, 0)
//   },
// })
// var startGame = new Phaser.Class({
//   extends: Phaser.Scene,
//   preload: function() {
//     console.log('场景 1 preload');
//     this.load.image('gameover', 'assets/gameover.png')
//   },
//   create: function() {
//     this.add.image(0, 0, 'gameover').setOrigin(0, 0)
//   }
// })

var config = {
  type: Phaser.AUTO,
  width: this.width,
  height: this.height,
  scene: [backgroundScene, startGame, playGame, gameoverScene]
};

var game = new Phaser.Game(config);