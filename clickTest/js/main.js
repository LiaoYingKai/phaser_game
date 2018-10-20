class playGame extends Phaser.Scene {
  create() {
    let clickCount = 0;
    this.clickCountText = this.add.text(100, 200, '');

    this.clickButton = new Phaser.GameObjects.Text(this, 100, 100, 'Click me!', {
      color: 'red'
    });
    this.add.existing(this.clickButton);
    this.clickButton
      .setInteractive({
        useHandCursor: true
      })
      .on('pointerover', () => this.enterButtonHoverState())
      .on('pointerout', () => this.enterButtonRestState())
      .on('pointerdown', () => this.enterButtonActiveState())
      .on('pointerup', () => {
        this.updateClickCountText(++clickCount);
      });

    this.updateClickCountText(clickCount);
  }

  updateClickCountText(clickCount) {
    console.log('>>>>>>>>>>>>>>button click')
    this.clickCountText.setText(`Button has been clicked ${clickCount} times.`);
  }

  enterButtonHoverState() {
    console.log('>button in')
  }

  enterButtonRestState() {
    console.log('>>>button out')
  }

  enterButtonActiveState() {
    console.log('>>>>>>button active')
  }
}


var config = {
  type: Phaser.AUTO,
  width: 480,
  height: 320,
  scene: [playGame]
}

var game = new Phaser.Game(config)