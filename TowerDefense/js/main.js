var config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 640,
  height: 512,
  physics: {
    default: 'arcade'
  },
  scene: {
    key: 'main',
    preload: preload,
    create: create,
    update: update
  }
}
var game = new Phaser.Game(config)

var path
var turrets;
var enemies;
//敵人的速度
var ENEMY_SPEED = 1 / 10000
//子彈的攻擊力
var BULLET_DAMAGE = 50
//地圖可以放炮塔的地方，-1爲不能放
var map = [
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, -1, -1, -1, -1, -1, -1, -1, 0, 0],
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
  initialize: function Enemy(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy')
    this.follower = {
      t: 0,
      vec: new Phaser.Math.Vector2()
    }
  },
  startOnPath: function() {
    this.follower.t = 0
    this.hp = 500

    path.getPoint(this.follower.t, this.follower.vec)
    this.setPosition(this.follower.vec.x, this.follower.vec.y)
  },
  receiveDamage: function(damage) {
    this.hp -= damage
    if (this.hp <= 0) {
      this.setActive(false)
      this.setVisible(false)
    }
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
//判斷半徑範圍
function getEnemy(x, y, distance) {
  var enemyUnits = enemies.getChildren()
  for (var i = 0; i < enemyUnits.length; i++) {
    if (enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance) {
      return enemyUnits[i]
    }
  }
  return false
}

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
  fire: function() {
    //偵測敵人是否到半徑的範圍(第三個參數)
    var enemy = getEnemy(this.x, this.y, 500)
    if (enemy) {
      var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y)
      addBullet(this.x, this.y, angle)
      this.angle = (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG
      //(angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
    }
  },
  update: function(time, delta) {
    if (time > this.nextTic) {
      this.fire()
      this.nextTic = time + 500
    }
  }
})

var Bullet = new Phaser.Class({
  Extends: Phaser.GameObjects.Image,
  initialize: function bullet(scene) {
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet')
    this.dx = 0
    this.dy = 0
    this.lifespan = 0
    //子彈速度
    this.speed = Phaser.Math.GetSpeed(600, 1)
  },
  fire: function(x, y, angle) {
    this.setActive(true)
    this.setVisible(true)
    this.setPosition(x, y)

    this.dx = Math.cos(angle)
    this.dy = Math.sin(angle)

    //子彈存活的秒數(毫秒)
    this.lifespan = 600
  },
  update: function(time, delta) {
    this.lifespan -= delta

    this.x += this.dx * (this.speed * delta)
    this.y += this.dy * (this.speed * delta)

    if (this.lifespan <= 0) {
      this.setActive(false)
      this.setVisible(false)
    }
  },
})

function create() {
  var graphics = this.add.graphics();
  drawGrid(graphics);

  //線的路徑
  path = this.add.path(96, -32);
  path.lineTo(96, 164);
  path.lineTo(480, 164);
  path.lineTo(480, 544);
  //線的樣式
  graphics.lineStyle(3, 0xffffff, 1);
  //畫線
  path.draw(graphics);
  console.log(Phaser.Class)

  //   //將敵人加入地圖
  enemies = this.physics.add.group({
    classType: Enemy,
    runChildUpdate: true
  });
  turrets = this.add.group({
    classType: Turret,
    runChildUpdate: true
  })
  //加入監聽，點擊可以加入炮塔
  bullets = this.physics.add.group({
    classType: Bullet,
    runChildUpdate: true
  })
  this.nextEnemy = 0;
  this.physics.add.overlap(enemies, bullets, damageEnemy)
  this.input.on('pointerdown', placeTurret)
}

function damageEnemy(enemy, bullet) {
  if (enemy.active === true && bullet.active === true) {
    bullet.setActive(false)
    bullet.setVisible(false)
    enemy.receiveDamage(BULLET_DAMAGE)
  }
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
//看地圖的炮塔要改得位置是否爲 0
function canPlaceTurret(i, j) {
  return map[i][j] === 0;
}
//發射子彈
function addBullet(x, y, angle) {
  var bullet = bullets.get()
  if (bullet) {
    bullet.fire(x, y, angle)
  }
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
//
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