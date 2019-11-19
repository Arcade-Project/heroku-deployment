import Phaser from 'phaser';

export default class HeadSoccer extends Phaser.Scene {
  constructor() {
    super({ key: 'HeadSoccer' });
    this.scoreHub = {};
    this.store = {
      left: 0,
      right: 0,
    }
  }

  preload() {
    this.load.image('playerRight', 'assets/HeadSoccer/jugador1izq.png');
    this.load.image('playerLeft', 'assets/HeadSoccer/jugador1der.png');
    this.load.image('ball', 'assets/HeadSoccer/ball.png');
    this.load.image('background', 'assets/HeadSoccer/background.jpg');
    this.load.audio('goal', 'assets/HeadSoccer/goal.mp3');
    this.load.audio('endgame', 'assets/HeadSoccer/endgame.wav');
    var url;
    url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/plugins/dist/rexvirtualjoystickplugin.min.js';
    this.load.plugin('rexvirtualjoystickplugin', url, true);
  }

  create() {
    let width = this.sys.game.config.width;
    let height = this.sys.game.config.height;
    let initialLeft = width/16;
    let initialRight = width - width/16;

    this.goal = this.sound.add('goal', { loop: false });
    this.endgame = this.sound.add('endgame', { loop: false });
    this.background = this.add.image(0, 0, 'background');
    this.background.displayHeight = height*2;
    this.background.displayWidth = width*2;
    this.createScore();

    this.playerLeft = this.physics.add.sprite(initialLeft, 750, 'playerLeft');
    this.playerRight = this.physics.add.sprite(initialRight, 750, 'playerRight');

    this.ball = this.physics.add.image(200, 100, 'ball');

    this.ball.setCircle(15);

    this.playerLeft.setBounce(0.2);
    this.playerLeft.setCollideWorldBounds(true);
    this.playerRight.setBounce(0.2);
    this.playerRight.setCollideWorldBounds(true);
    this.playerLeft.setCircle(40);
    this.playerRight.setCircle(40);

    //Physics
    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);
    this.physics.world.setBoundsCollision(false, false, true, true);
    this.physics.world.gravity.y = 1000;
    this.physics.add.collider(
      this.ball,
      this.playerLeft,
      this.hitLeftPlayer,
      null,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.playerRight,
      this.hitRightPlayer,
      null,
      this
    );
    this.physics.add.collider(
      this.playerLeft,
      this.playerRight,
      this.hitTwoPlayer,
      null,
      this
    );

    //LeftPlayer
    this.cursor_W = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.W
    );
    this.cursor_S = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    );
    this.cursor_A = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.A
    );
    this.cursor_D = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.D
    );

    // RightPlayer
    this.cursor = this.input.keyboard.createCursorKeys();

    //choistick left
    this.joyStickLeft = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: initialLeft,
      y: height - height/8,
      radius: 100,
      base: this.add.graphics().fillStyle(0x888888,0.2).fillCircle(0, 0, 30),
      thumb: this.add.graphics().fillStyle(0xcccccc,0.2).fillCircle(0, 0,15),
      // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
       dir: 2,   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
      // forceMin: 16,
       enable: true
  })
  .on('update', this.joystickLeft, this);

this.joystickLeft();

//choistick Right
this.joyStickRight = this.plugins.get('rexvirtualjoystickplugin').add(this, {
  x: initialRight,
  y: height - height/8,
  radius: 100,
  base: this.add.graphics().fillStyle(0x888888,0.2).fillCircle(0, 0, 30),
  thumb: this.add.graphics().fillStyle(0xcccccc,0.2).fillCircle(0, 0,15),
  // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
   dir: 2,   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
  // forceMin: 16,
   enable: true
})
.on('update', this.joystickRight, this);

this.joystickRight();
  }



  update() {
    this.scoreboard();
    this.rightController();
    this.leftController();
  }
  createScore() {
    const { left, right } = this.store;
    let width = this.sys.game.config.width;
    let center_width = width / 2;
    this.scoreHub = this.add.text(center_width - 60, 0, `${left} - ${right}`, {
      color: '#00ff00',
      backgroundColor: '#000000',
      fontSize: 40
    });
  }

  drawScoreboard() {
    const { left, right } = this.store;
    this.scoreHub.setText(`${left} - ${right}`);
  }

  scoreboard() {
    if (this.store.left > 4 || this.store.right > 4) {
      this.gameOver();
    } else {
      if (this.ball.x < 0) {
        console.log('punto para la derecha!!');
        this.store.right = this.store.right + 1;
        this.goal.play();
        this.drawScoreboard();
        this.resetBall('left');
      }
      if (this.ball.x > this.sys.game.config.width) {
        console.log('punto para la izquierda!!');
        this.store.left = this.store.left + 1;
        this.goal.play();
        this.drawScoreboard();
        this.resetBall('right');
      }
    }
  }

  gameOver() {
    let width = this.sys.game.config.width;
    const center_width = (screen) => {
      if (screen > 600) return width / 6;
      return width/64;
    }
    this.add.text(center_width(width), 100, 'Game Over', {
      fontSize: 100
    });
    this.endgame.play();
    this.playerLeft.setVisible(false);
    this.playerRight.setVisible(false);
    this.ball.setVisible(false);
    this.ball.destroy(true);
    this.store.right = 0;
    this.store.left = 0;
  }

  resetBall(direction) {
    let width = this.sys.game.config.width;
    let height = this.sys.game.config.height;
    let initialLeft = width/16;
    let initialRigth = width - width/16;
    this.ball.setPosition(
      width / 2,
      height / 2
    );
    this.playerLeft.setPosition(initialLeft, 750);
    this.playerRight.setPosition(initialRigth, 750);
    this.ball.body.setBounceX(1);
    this.ball.body.setVelocityX(200);
    if (direction !== 'left') {
      //this.ball.setVelocityX(Phaser.Math.Between(50,100));
      this.ball.setVelocityY(1);
    } else {
      //this.ball.setVelocityX(Phaser.Math.Between(-50,-100));
      this.ball.setVelocityY(1);
    }
  }

  rightController() {
    //Controller Right
    if (this.cursor.down.isDown) {
      this.playerRight.body.setVelocityY(300);
    } else if (this.cursor.up.isDown && this.playerRight.body.y > 200) {
      this.playerRight.body.setAccelerationY(5000);
      this.playerRight.body.setVelocityY(-300);
    } else if (this.cursor.left.isDown) {
      this.playerRight.body.setVelocityX(-300);
    } else if (this.cursor.right.isDown) {
      this.playerRight.body.setVelocityX(300);
    } else {
      this.playerRight.body.setVelocityY(0);
      this.playerRight.body.setVelocityX(0);
    }
  }

  joystickRight() {
    //Controller Right
    var cursorKeys = this.joyStickRight.createCursorKeys();
    if (cursorKeys.down.isDown) {
      this.playerRight.body.setVelocityY(300);
    } else if (cursorKeys.up.isDown && this.playerRight.body.y > 200) {
      this.playerRight.body.setAccelerationY(5000);
      this.playerRight.body.setVelocityY(-300);
    } else if (cursorKeys.left.isDown) {
      this.playerRight.body.setVelocityX(-300);
    } else if (cursorKeys.right.isDown) {
      this.playerRight.body.setVelocityX(300);
    } else {
      this.playerRight.body.setVelocityY(0);
      this.playerRight.body.setVelocityX(0);
    }
  }


  leftController() {
    //Controller left
    if (this.cursor_S.isDown) {
      this.playerLeft.body.setVelocityY(300);
    } else if (this.cursor_W.isDown && this.playerLeft.body.y > 200) {
      this.playerLeft.body.setVelocityY(-500);
      this.playerLeft.body.setAccelerationY(5000);
    } else if (this.cursor_A.isDown) {
      this.playerLeft.body.setVelocityX(-300);
    } else if (this.cursor_D.isDown) {
      this.playerLeft.body.setVelocityX(300);
    } else {
      this.playerLeft.body.setVelocityY(0);
      this.playerLeft.body.setVelocityX(0);
    }
  }
  joystickLeft() {
    //Controller left
    var cursorKeys = this.joyStickLeft.createCursorKeys();
    if (cursorKeys.down.isDown) {
      this.playerLeft.body.setVelocityY(300);
    } else if (cursorKeys.up.isDown && this.playerLeft.body.y > 200) {
      this.playerLeft.body.setVelocityY(-500);
      this.playerLeft.body.setAccelerationY(5000);
    } else if (cursorKeys.left.isDown) {
      this.playerLeft.body.setVelocityX(-300);
    } else if (cursorKeys.right.isDown) {
      this.playerLeft.body.setVelocityX(300);
    } else {
      this.playerLeft.body.setVelocityY(0);
      this.playerLeft.body.setVelocityX(0);
    }
  }

  hitRightPlayer() {
    /*  this.ball.setVelocityY(300);
    this.ball.setVelocityX(120); */
  }
  hitLeftPlayer() {
    /*     this.ball.setVelocityY(300);
    this.ball.setVelocityX(-120); */
  }
}
