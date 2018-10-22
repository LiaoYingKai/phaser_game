var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 640,
  height: 512,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}
var game = new Phaser.Game(config)

var graphics
var path
//敵人的速度
var ENEMY_SPEED = 1 / 10000
//地圖可以放炮塔的地方，-1爲不能放
var map = [
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, -1, -1, 0, -1, -1, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, -1, 0, 0]
];

function preload() {
  this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json')
  this.load.image('bullet', 'assets/bullet.png')
}

var Enemy = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize:

    function Enemy(scene) {
      Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy')
      this.follower = {
        t: 0,
        vec: new Phaser.Math.Vector2()
      }
    },
  startOnPath: function() {
    this.follower.t = 0
    path.getPoint(this.follower.t, this.follower.vec)
    this.setPosition(this.follower.vec.x, this.follower.vec.y)
  },
  update: function(time, delta) {
    this.follower.t += ENEMY_SPEED * delta;
    path.getPoint(this.follower.t, this.follower.vec);
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
})
var Turret = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function Turret(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret')
    this.nextTic = 0
  },
  place: function(i, j) {
    this.y = i * 64 + 64 / 2
    this.x = j * 64 + 64 / 2
    map[i][j]
  },
  update: function(time, delta) {
    if (time > this.nextTic) {
      this.nextTic = time + 1000
    }
  }
})

function create() {
  var graphics = this.add.graphics();
  //線的路徑
  path = this.add.path(96, -32);
  path.lineTo(96, 164);
  path.lineTo(480, 164);
  path.lineTo(480, 544);
  //線的樣式
  graphics.lineStyle(3, 0xffffff, 1);
  //畫線
  path.draw(graphics);
  var graphics = this.add.graphics();
  drawGrid(graphics);

  //將敵人加入地圖
  enemies = this.add.group({
    classType: Enemy,
    runChildUpdate: true
  });
  this.nextEnemy = 0;
  turrets = this.add.group({
    classType: Turret,
    runChildUpdate: true
  })
  //加入監聽，點擊可以加入炮塔
  this.input.on('pointerdown', placeTurret)
}
//建立炮塔的方式
function placeTurret(pointer) {
  var i = Math.floor(pointer.y / 64)
  var j = Math.floor(pointer.x / 64)
  if (canPlaceTurret(i, j)) {
    //取得炮塔的物件
    var turret = turrets.get()
    if (turret) {
      turret.setActive(true);
      turret.setVisible(true);
      turret.place(i, j)
    }
  }
}
//看地圖的炮塔是否爲 0，是的話回傳true
function canPlaceTurret(i, j) {
  return map[i][j] === 0;
}

function drawGrid(graphics) {
  //畫格子的數量(數量決定可以放的炮塔)
  graphics.lineStyle(1, 0x000ff, 0.8)
  for (var i = 0; i < 8; i++) {
    //從座標(0,64)畫到(640,64)，以此類推
    graphics.moveTo(0, i * 64)
    graphics.lineTo(640, i * 64)
  }
  //從座標(64,0)畫到(64,512)，以此類推
  for (var j = 0; j < 10; j++) {
    graphics.moveTo(j * 64, 0)
    graphics.lineTo(j * 64, 512)
  }
  graphics.strokePath()
}

function update(time, delta) {
  if (time > this.nextEnemy) {
    //取得敵人的物件
    var enemy = enemies.get();
    if (enemy) {
      enemy.setActive(true);
      enemy.setVisible(true);
      enemy.startOnPath();
      //每一個球間隔的時間
      this.nextEnemy = time + 2000;
    }
  }
}