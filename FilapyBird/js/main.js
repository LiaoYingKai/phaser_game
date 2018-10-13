var width = 288
var height = 505
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
    this.add.image(0, height / 5 * 4, 'ground').setOrigin(0, 0)
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
  }
  create() {
    this.add.image(144, 300, 'startButton')
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
    this.load.image('getReady', 'assets/get-ready.png')
  }
  create() {
    this.add.image(0, 0, 'getReady').setOrigin(0, 0)
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