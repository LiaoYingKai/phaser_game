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

var checkerboard = createCheckerboard()
var status = "o"
var self

function createCheckerboard() {
  let checkerboard = []
  for (let i = 0; i < 20; i++) {
    checkerboard[i] = new Array()
    for (let j = 0; j < 20; j++) {
      checkerboard[i][j] = 0
    }
  }
  return checkerboard
}

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
  this.load.image('black', 'assets/black.jpg')
  this.load.image('white', 'assets/white.jpg')
}

function create() {
  self = this
  let path = this.add.path(0, 15)
  let graphics = this.add.graphics()
  drawCheckerboard(graphics)
  path.draw(graphics)

  this.input.on('pointerdown', putChess)
}

function putChess(pointer) {
  let j = Math.floor(pointer.x / 30)
  let i = Math.floor(pointer.y / 30)
  console.log(j, i)
  if (isEnpty(j, i)) {
    if (status == "o") {
      checkerboard[j][i] = status
      status = 'x'
      self.add.image(15 + j * 30, 15 + i * 30, 'black')
    } else if (status == "x") {
      checkerboard[j][i] = status
      status = "o"
      self.add.image(15 + j * 30, 15 + i * 30, 'white')
    }
    if (horizontalWin(j, i)) {
      console.log('fuck')
    }
    if (straightWin(j, i)) {
      console.log('shit')
    }
  }
}

function isEnpty(j, i) {
  return checkerboard[j][i] === 0
}

function horizontalWin(j, i) {
  let count = 1
  //左右
  for (let x = 1; x < 5; x++) {
    if (checkerboard[j][i] === checkerboard[j - x][i]) {
      count += 1
    } else {
      break
    }
  }
  for (let x = 1; x < 5; x++) {
    if (checkerboard[j][i] === checkerboard[j + x][i]) {
      count += 1
    } else {
      break
    }
  }
  return count >= 5
}

//上下
function straightWin(j, i) {
  let count = 1
  //左右
  for (let y = 1; y < 5; y++) {
    if (checkerboard[j][i] === checkerboard[j][i - y]) {
      count += 1
    } else {
      break
    }
  }
  for (let y = 1; y < 5; y++) {
    if (checkerboard[j][i] === checkerboard[j][i + y]) {
      count += 1
    } else {
      break
    }
  }
  return count >= 5
}
//左上到右下

//右上到左下