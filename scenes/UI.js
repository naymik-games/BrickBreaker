class UI extends Phaser.Scene {

  constructor() {

    super("UI");
  }
  preload() {



  }
  create() {
    this.bounceCount = 0;
    this.doubleCount = 0;
    this.bombCount = 0;
    this.upCount = 0;
    this.level = 1;
    this.levelText = this.add.bitmapText(game.config.width / 2, topP / 2, 'lato', '1', 130).setOrigin(.5);
    this.highText = this.add.bitmapText(game.config.width / 2 + 115, topP / 2 - 45, 'lato', gameData.best, 50).setOrigin(.5).setTint(0xff0000);

    this.predict = false
    this.predictLevel = 0

    this.star = this.physics.add.image(725, topP / 2, 'gems', 6).setScale(.75);
    this.starText = this.add.bitmapText(825, topP / 2, 'lato', '0', 70).setOrigin(.5);

    //this.blockText = this.add.bitmapText(75, topP / 2, 'lato', blockCount, 70).setOrigin(.5);
    if (gameMode == 'puzzle') {
      var rd = round + 1
      var text = 'Round ' + rd;
      this.blockText = this.add.bitmapText(75, topP / 2, 'lato', text, 70).setOrigin(0, .5);
    } else {
      this.blockText = this.add.bitmapText(75, topP / 2, 'lato', 'Classic', 70).setOrigin(0, .5);

    }

    var Main = this.scene.get('PlayGame');
    this.Main = Main
    Main.events.on('level', function (data) {
      this.levelText.setText(data.level)
      if (this.predict) {
        if (this.predictLevel + 5 == data.level) {
          this.predict = false
          this.Main.predictive = false
        }
      }
    }, this);

    Main.events.on('star', function (data) {
      this.starText.setText(data.star);
      if (data.star % 5 == 0) {
        this.createPU();
      }
    }, this);
    Main.events.on('pu', function (data) {

      this.createPU(data.type);

    }, this);
    Main.events.on('block', function () {
      //console.log('dots ' + string)
      // this.blockText.setText(blockCount);
    }, this);

    this.redo = this.add.image(825, game.config.height - topP / 2, 'icons', 1).setInteractive();
    this.redo.on('pointerdown', function () {
      this.scene.start("PlayGame");
      this.scene.start("UI");
    }, this)

    this.home = this.add.image(700, game.config.height - topP / 2, 'icons', 3).setInteractive();
    this.home.on('pointerdown', function () {
      this.scene.start("startGame");
      this.scene.stop("PlayGame");
      this.scene.stop("UI");

    }, this)


    //action icons and click hangler
    //BOUNCE///////////////////////////
    this.bounce = this.add.image(75, game.config.height - topP / 2 - 30, 'gems', 10).setScale(.8).setAlpha(.5).setInteractive();
    this.bounceText = this.add.bitmapText(75, game.config.height - topP / 2 + 50, 'lato', '0', 60).setOrigin(.5);

    this.bounce.on('pointerdown', function () {
      if (gameState == WAITING_FOR_PLAYER_INPUT && this.bounceCount > 0) {
        this.events.emit('bounce');
        this.bounceCount--;
        this.bounceText.setText(this.bounceCount);
        if (bounceCount == 0) {
          this.bounce.setAlpha(.5)
        }
      }
    }, this);
    //DOUBLE//////////////////////////
    this.double = this.add.image(200, game.config.height - topP / 2 - 30, 'gems', 11).setScale(.8).setAlpha(.5).setInteractive();
    this.doubleText = this.add.bitmapText(200, game.config.height - topP / 2 + 50, 'lato', '0', 60).setOrigin(.5);
    this.double.on('pointerdown', function () {
      if (gameState == WAITING_FOR_PLAYER_INPUT && this.doubleCount > 0) {
        this.events.emit('double');
        this.doubleCount--;
        this.doubleText.setText(this.doubleCount);
        if (doubleCount == 0) {
          this.double.setAlpha(.5)
        }
      }
    }, this);
    //BOMB////////////////////////////
    this.bomb = this.add.image(325, game.config.height - topP / 2 - 30, 'gems', 12).setScale(.8).setAlpha(.5).setInteractive();
    this.bombText = this.add.bitmapText(325, game.config.height - topP / 2 + 50, 'lato', '0', 60).setOrigin(.5);
    this.bomb.on('pointerdown', function () {
      if (gameState == WAITING_FOR_PLAYER_INPUT && this.bombCount > 0) {
        this.events.emit('bomb');
        this.bombCount--;
        this.bombText.setText(this.bombCount);
        if (bombCount == 0) {
          this.bomb.setAlpha(.5)
        }
      }
    }, this);
    //UP//////////////////////////////
    this.up = this.add.image(450, game.config.height - topP / 2 - 30, 'gems', 13).setScale(.8).setAlpha(.5).setInteractive();
    this.upText = this.add.bitmapText(450, game.config.height - topP / 2 + 50, 'lato', '0', 60).setOrigin(.5);
    this.up.on('pointerdown', function () {
      if (gameState == WAITING_FOR_PLAYER_INPUT && this.upCount > 0) {
        this.events.emit('up');
        this.upCount--;
        this.upText.setText(this.upCount);
        if (upCount == 0) {
          this.up.setAlpha(.5)
        }
      }
    }, this);

    if (this.gameState == WAITING_FOR_PLAYER_INPUT) {






    }


    this.bounceIcon = this.add.image(-100, -100, 'gems', 10).setScale(1.5);
    this.doubleIcon = this.add.image(-100, -100, 'gems', 11).setScale(1.5);
    this.bombIcon = this.add.image(-100, -100, 'gems', 12).setScale(1.5);
    this.upIcon = this.add.image(-100, -100, 'gems', 13).setScale(1.5);

  }




  update() {

  }
  createPU(action) {
    /*    if (pu.type == 10) {
         console.log('bounce')
       } else if (pu.type == 11) {
         console.log('double')
       } else if (pu.type == 12) {
         console.log('bomb')
       } else if (pu.type == 13) {
         console.log('move up')
       } else if (pu.type == 14) {
         console.log('plus 5')
       } else if (pu.type == 15) {
         console.log('golden aim')
       } */
    //  var action = Phaser.Math.Between(0, 3);
    if (action == 10) {
      this.bounceIcon.setPosition(this.star.x, this.star.y);
      this.bounceCount++;
      var tween = this.tweens.add({
        targets: this.bounceIcon,
        x: this.bounce.x,
        y: this.bounce.y,
        scale: .2,
        duration: 1000,
        onCompleteScope: this,
        onComplete: function () {
          this.bounce.setAlpha(1);
          this.bounceIcon.setPosition(-100, -100).setScale(1.5);
          this.bounceText.setText(this.bounceCount)
        }
      });
    } else if (action == 11) {
      this.doubleIcon.setPosition(this.star.x, this.star.y);
      this.doubleCount++;
      var tween = this.tweens.add({
        targets: this.doubleIcon,
        x: this.double.x,
        y: this.double.y,
        scale: .2,
        duration: 1000,
        onCompleteScope: this,
        onComplete: function () {
          this.double.setAlpha(1);
          this.doubleIcon.setPosition(-100, -100).setScale(1.5);
          this.doubleText.setText(this.doubleCount)
        }
      });
    } else if (action == 12) {
      this.bombIcon.setPosition(this.star.x, this.star.y);
      this.bombCount++;
      var tween = this.tweens.add({
        targets: this.bombIcon,
        x: this.bomb.x,
        y: this.bomb.y,
        scale: .2,
        duration: 1000,
        onCompleteScope: this,
        onComplete: function () {
          this.bomb.setAlpha(1);
          this.bombIcon.setPosition(-100, -100).setScale(1.5);
          this.bombText.setText(this.bombCount)
        }
      });
    } else if (action == 13) {
      this.upIcon.setPosition(this.star.x, this.star.y);
      this.upCount++;
      var tween = this.tweens.add({
        targets: this.upIcon,
        x: this.up.x,
        y: this.up.y,
        scale: .2,
        duration: 1000,
        onCompleteScope: this,
        onComplete: function () {
          this.up.setAlpha(1);
          this.upIcon.setPosition(-100, -100).setScale(1.5);
          this.upText.setText(this.upCount)
        }
      });
    } else if (action == 14) {
      /*  this.upIcon.setPosition(this.star.x, this.star.y);
       this.upCount++;
       var tween = this.tweens.add({
         targets: this.upIcon,
         x: this.up.x,
         y: this.up.y,
         scale: .2,
         duration: 1000,
         onCompleteScope: this,
         onComplete: function() {
           this.up.setAlpha(1);
           this.upIcon.setPosition(-100, -100).setScale(1.5);
           this.upText.setText(this.upCount)
         }
       }); */
    } else if (action == 15) {
      this.predict = true
      this.predictLevel = this.Main.level
      this.Main.predictive = true
    }
  }
  destroyBlockTween(blockX, blockY) {

    var particles = this.add.particles("particles");

    //.setTint(0x7d1414);
    var emitter = particles.createEmitter({
      // particle speed - particles do not move
      // speed: 1000,
      frame: { frames: [0, 1, 2, 3], cycle: true },

      speed: {
        min: -500,
        max: 500
      },
      // particle scale: from 1 to zero
      scale: {
        start: 2,
        end: 0
      },
      // particle alpha: from opaque to transparent
      alpha: {
        start: 1,
        end: 1
      },
      // particle frequency: one particle every 100 milliseconds
      frequency: 25,
      // particle lifespan: 1 second
      lifespan: 1000
    });
    //emitter.tint.onChange(0x7d1414);
    emitter.explode(20, blockX, blockY);


  }

}