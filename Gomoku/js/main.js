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
  this.load.image('black', 'assets/black.png')
  this.load.image('white', 'assets/white.png')
}

function create() {
  self = this
  var socket = io('http://localhost:3000/');
  let path = this.add.path(0, 15)
  let graphics = this.add.graphics()
  drawCheckerboard(graphics)
  path.draw(graphics)

  this.input.on('pointerdown', putChess)
}

function putChess(pointer) {
  let i = Math.floor(pointer.y / 30)
  let j = Math.floor(pointer.x / 30)
  console.log(i, j)
  if (isEnpty(i, j)) {
    if (status == "o") {
      checkerboard[i][j] = status
      self.add.image(15 + j * 30, 15 + i * 30, 'black')
    } else if (status == "x") {
      checkerboard[i][j] = status
      self.add.image(15 + j * 30, 15 + i * 30, 'white')
    }

    if (horizontalWin(i, j) || straightWin(i, j) || rightOblique(i, j) || leftOblique(i, j)) {
      console.log(status + ' is fuck winner')
      console.log('fuck')
    }
    status = status === 'o' ? 'x' : 'o'
  }

}

function isEnpty(i, j) {
  return checkerboard[i][j] === 0
}

//左右
function horizontalWin(i, j) {
  let count = 1
  for (let x = 1; x < 5; x++) {
    if (checkerboard[i][j] === checkerboard[i][j - x]) {
      count += 1
    } else {
      break
    }
  }
  for (let x = 1; x < 5; x++) {
    if (checkerboard[i][j] === checkerboard[i][j + x]) {
      count += 1
    } else {
      break
    }
  }
  return count >= 5
}

//上下
function straightWin(i, j) {
  let count = 1
  for (let y = 1; y < 5; y++) {
    if (i - y < 0) {
      break
    }
    if (checkerboard[i][j] === checkerboard[i - y][j]) {
      count += 1
      // if (checkerboard[j][i - y - 1]) {
      //   break
      // }
    } else {
      break
    }
  }
  for (let y = 1; y < 5; y++) {
    if (i + y > 19) {
      break
    }
    if (checkerboard[i][j] === checkerboard[i + y][j]) {
      count += 1
      // if (checkerboard[j][i + y + 1]) {
      //   break
      // }
    } else {
      break
    }
  }
  return count >= 5
}

//右上到左下
function rightOblique(i, j) {
  let count = 1

  for (let y = 1; y < 5; y++) {
    if (i - y < 0) {
      break
    }
    if (checkerboard[i][j] === checkerboard[i - y][j + y]) {
      count += 1
    } else {
      break
    }
  }
  for (let y = 1; y < 5; y++) {
    if (i + y > 19) {
      break
    }
    if (checkerboard[i][j] === checkerboard[i + y][j - y]) {
      count += 1
    } else {
      break
    }
  }
  return count >= 5
}
//左上到右下
function leftOblique(i, j) {
  let count = 1
  for (let y = 1; y < 5; y++) {
    if (i - y < 0) {
      break
    }
    if (checkerboard[i][j] === checkerboard[i - y][j - y]) {
      count += 1
    } else {
      break
    }
  }
  for (let y = 1; y < 5; y++) {
    if (i + y > 19) {
      break
    }
    if (checkerboard[i][j] === checkerboard[i + y][j + y]) {
      count += 1
    } else {
      break
    }
  }
  return count >= 5
}