var config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  backgroundColor: 0x705045,
  scene: {
    preload: preload,
    create: create,
  }
}

var game = new Phaser.Game(config)

var camp
var self
var socket
var status = 'o'
var gameStatusText

function drawCheckerboard(graphics) {
  graphics.lineStyle(1, 0xffffff, 1)
  for (let i = 0; i < 20; i++) {
    graphics.moveTo(0, 14.5 + i * 30);
    graphics.lineTo(600, 14.5 + i * 30)
  }
  for (let j = 0; j < 20; j++) {
    graphics.moveTo(14.5 + j * 30, 0)
    graphics.lineTo(14.5 + j * 30, 600)
  }
  graphics.strokePath()
}

function preload() {
  this.load.image('black', 'assets/black.png')
  this.load.image('white', 'assets/white.png')
}

function create() {
  self = this
  // socket = io('http://localhost:3000/');
  socket = io('http://172.20.10.7:3000/');

  let path = this.add.path(0, 15)
  let graphics = this.add.graphics()
  drawCheckerboard(graphics)
  path.draw(graphics)
  gameStatusText = this.add.text(250, 16, '等待中', {
    fontSize: '32px',
    fill: '#fff'
  })
  socket.on('drawChess', function(i, j) {
    updateCheckerboard(i, j)
  })
  socket.on('winner', function(player) {
    if (player === 'o') {
      gameStatusText.setText("黑子獲勝")
      console.log('黑子獲勝')
    }
    if (player === 'x') {
      gameStatusText.setText("白子獲勝")
      console.log('白子獲勝')
    }
    self.scene.pause();
    socket.disconnect()
    //重新開始
    // self.scene.restart()
    status = 'o'
  })
  socket.on('changeYou', yourRound => {
    if (yourRound) {
      console.log('fuck')
      gameStatusText.setText("你的回合")
      self.input.on('pointermove', predeterminedLocation)
      self.input.on('pointerdown', putChess)
    }
  })
}

function predeterminedLocation(pointer) {
  let i = Math.floor(pointer.y / 30)
  let j = Math.floor(pointer.x / 30)
}

function updateCheckerboard(i, j) {
  //畫到畫布
  if (status === "o") {
    self.add.image(15 + j * 30, 15 + i * 30, 'black')
  } else if (status == "x") {
    self.add.image(15 + j * 30, 15 + i * 30, 'white')
  }
  status = status === 'o' ? 'x' : 'o'
}

function putChess(pointer) {
  //送訊息給scoket
  let i = Math.floor(pointer.y / 30)
  let j = Math.floor(pointer.x / 30)
  socket.emit('putChess', i, j)
  gameStatusText.setText("")
}