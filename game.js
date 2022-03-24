let game;

window.onload = function () {
  let gameConfig = {
    type: Phaser.AUTO,
    backgroundColor: 0x000000,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame",
      width: 900,
      height: 1640
    },
    physics: {
      default: "arcade"
    },
    scene: [preloadGame, startGame, selectGame, playGame, UI, endGame]
  }
  game = new Phaser.Game(gameConfig);
  window.focus();
}



class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }
  preload() {
    //this.load.plugin('rexraycasterplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexraycasterplugin.min.js', true);

  }
  create() {
    this.cameras.main.fadeIn(800, 0, 0, 0);



    console.log(rounds[round])
    // {col: 10, row: 13, max: 7, startBalls: 5, startLines: 5, startValue: 5},
    if (gameMode == 'puzzle') {
      gameOptions.blocksPerLine = rounds[round].col,
        gameOptions.blockLines = rounds[round].row,
        gameOptions.maxBlocksPerLine = rounds[round].max,
        gameOptions.numBallsStart = rounds[round].startBalls,
        gameOptions.numLinesStart = rounds[round].startLines,
        gameOptions.startingValue = rounds[round].startValue,
        gameOptions.levelGoal = rounds[round].levelGoal
      this.allowBlocked = true;
    } else if (gameMode == 'easy') {
      gameOptions.blocksPerLine = 8,
        gameOptions.blockLines = 11,
        gameOptions.maxBlocksPerLine = 6,
        gameOptions.numBallsStart = 1,
        gameOptions.numLinesStart = 1,
        gameOptions.startingValue = 0,
        gameOptions.levelGoal = 300
      this.allowBlocked = false;
      gameOptions.ballSize = 0.05;
    } else {
      gameOptions.blocksPerLine = 10,
        gameOptions.blockLines = 13,
        gameOptions.maxBlocksPerLine = 9,
        gameOptions.numBallsStart = 1,
        gameOptions.numLinesStart = 1,
        gameOptions.startingValue = 0,
        gameOptions.levelGoal = 300
      this.allowBlocked = true;

    }



    this.mark = 0;
    blockCount = 0;

    this.starCount = 0;
    this.starPlaced = false;

    this.bouncePU = false;
    this.bouncePULanded = 0;

    this.doublePU = false;

    this.bombPU = false;

    // at the beginning of the game, we wait for player input
    gameState = WAITING_FOR_PLAYER_INPUT;

    this.gameOver = false;

    this.level = 0;

    this.specialArray = [];
    this.recycledBlocks = [];
    this.recycledSpecials = [];

    this.blockSize = game.config.width / gameOptions.blocksPerLine;
    this.gameFieldHeight = this.blockSize * gameOptions.blockLines;
    this.emptySpace = game.config.height - this.gameFieldHeight;


    this.physics.world.setBounds(0, this.emptySpace / 2, game.config.width, this.gameFieldHeight);

    this.blockGroup = this.physics.add.group();
    this.ballGroup = this.physics.add.group();
    this.extraBallGroup = this.physics.add.group();
    this.specialGroup = this.physics.add.group();

    let scorePanel = this.add.sprite(game.config.width / 2, 0, "panel");
    scorePanel.displayWidth = game.config.width;
    scorePanel.displayHeight = this.emptySpace / 2;
    scorePanel.setOrigin(0.5, 0);
    scorePanel.setTint(0x222222)
    topP = scorePanel.displayHeight;

    this.bottomPanel = this.add.sprite(game.config.width / 2, game.config.height, "panel2");
    this.bottomPanel.displayWidth = game.config.width;
    this.bottomPanel.displayHeight = this.emptySpace / 2;
    this.bottomPanel.setOrigin(0.5, 1);
    this.bottomPanel.setTint(0x222222)

    this.ballSize = game.config.width * gameOptions.ballSize;


    this.colorText = this.add.bitmapText(game.config.width - 75, this.bottomPanel.y - (this.bottomPanel.displayHeight + 50), 'lato', '0xffffff', 40).setOrigin(.5).setInteractive();

    this.changeBG();



    //	this.ballSize = this.blockSize * .5;
    // add the first ball
    for (var i = 0; i < gameOptions.numBallsStart; i++) {
      this.addBall(game.config.width / 2, game.config.height - this.bottomPanel.displayHeight - this.ballSize / 2, false, 0);
    }

    this.star = this.physics.add.image(450, -100, 'gems', 6);
    this.star.displayHeight = this.blockSize;
    this.star.displayWidth = this.blockSize;
    this.star.col = 0;
    this.star.setCircle(this.blockSize / 2);

    /*this.button = this.add.image(700, 1550, 'gems', 0).setInteractive();
    this.button.on('pointerdown', function() {
      this.doublePU = true;
      //this.bouncePU = true
      //this.bottomPanel.setTint(0x27ae61)
      //this.moveBlocksUp()
      //  this.removeBlockLine(2)
    }, this)*/



    // add the trajectory sprite
    this.addTrajectory();

    // add a block line
    if (gameMode == 'puzzle') {
      if (rounds[round].prefab.length > 0) {
        this.addBlockLinePrefab();
      } else {
        this.addBlockLine(gameOptions.numLinesStart);
      }

    } else {
      this.addBlockLine(gameOptions.numLinesStart);
    }


    // input listeners
    this.input.on("pointerdown", this.startAiming, this);
    this.input.on("pointerup", this.shootBall, this);
    this.input.on("pointermove", this.adjustAim, this);


    var UI = this.scene.get('UI');

    UI.events.on('bounce', function () {
      this.bouncePU = true
      this.bottomPanel.setTint(0x27ae61)

    }, this);

    UI.events.on('double', function () {
      this.doublePU = true;
      //fc6603
      this.ballGroup.setTint(0xfc6603);
    }, this);

    UI.events.on('bomb', function () {
      this.bombPU = true;
      //fc6603
      this.ballGroup.setTint(0xff0000);
    }, this);

    UI.events.on('up', function () {
      this.moveBlocksUp();

    }, this);

    // this.raycaster = this.plugins.get('rexraycasterplugin').add();
    // this.raycaster.addObstacle(this.blockGroup.getChildren());
    // this.debugGraphics = this.add.graphics();
    //runRaycaster(this.raycaster, 450,1500, Phaser.Math.DegToRad(-80), this.debugGraphics);
    // lister for collision with world bounds
    this.physics.world.on("worldbounds", this.checkBoundCollision, this);
  }

  changeBG() {
    var bgc = Phaser.Math.Between(0, bgColors.length - 1)
    this.cameras.main.setBackgroundColor(bgColors[bgc]);
    this.colorText.setText(bgc)
  }

  // method to add the ball at a given position x, y. The third argument tells us if it's an extra ball
  addBall(x, y, isExtraBall, r) {

    // ball creation as a child of ballGroup or extraBallGroup
    let ball = isExtraBall ? this.extraBallGroup.create(x, y, "ball") : this.ballGroup.create(x, y, "ball");

    // resize the ball
    ball.displayWidth = this.ballSize;
    ball.displayHeight = this.ballSize;

    // maximum bounce
    ball.body.setBounce(1, 1);

    // if it's an extra ball...
    if (isExtraBall) {

      // set a custom "row" property to 1
      ball.row = 1 + r;
      ball.setTint(0xff0000)

      // set a custom "collected" property to false
      ball.collected = false;
    }

    // if it's not an extra ball...
    else {

      // ball collides with world bounds
      ball.body.collideWorldBounds = true;

      // ball fires a listener when colliding on world bounds
      ball.body.onWorldBounds = true;
    }
  }

  // method to add a block line
  addBlockLine(numLines) {
    this.level++;
    this.events.emit('level', { level: this.level });
    this.doublePU = false;
    this.ballGroup.setTint(0xffffff);
    //this.levelText.setText(this.level)
    for (var r = 1; r < numLines + 1; r++) {
      // increase level number

      var color = Phaser.Math.Between(0, 21)
      // array where to store placed blocks positions
      let placedBlocks = [];

      // will we place an extra ball too?
      let placeExtraBall = Phaser.Math.Between(0, 100) < gameOptions.extraBallProbability;
      //let placeSpecial = Phaser.Math.Between(0, 100) < gameOptions.specialProbability;
      let placeSpecial = false;
      // exec=ute the block "gameOptions.maxBlocksPerLine" times
      for (let i = 0; i < gameOptions.maxBlocksPerLine; i++) {

        // random block position
        let blockPosition = Phaser.Math.Between(0, gameOptions.blocksPerLine - 1);

        // is this block position empty?
        if (placedBlocks.indexOf(blockPosition) == -1) {

          // save this block position
          placedBlocks.push(blockPosition);

          // should we place an extra ball?
          if (placeExtraBall) {

            // no more extra balls
            placeExtraBall = false;

            // add the extra ball
            this.addBall(blockPosition * this.blockSize + this.blockSize / 2, this.emptySpace / 2 + (this.blockSize * .5) + r * this.blockSize, true, r);
          }
          else if (placeSpecial) {
            placeSpecial = false;
            if (this.recycledSpecials.length == 0) {
              //addBlock(x, y, r, c, isRecycled
              this.addSpecial(blockPosition * this.blockSize + this.blockSize / 2, this.emptySpace / 2 + (this.blockSize * .5) + r * this.blockSize, r, blockPosition, false);

            } else {
              this.addSpecial(blockPosition * this.blockSize + this.blockSize / 2, this.emptySpace / 2 + (this.blockSize * .5) + r * this.blockSize, r, blockPosition, true);

            }
          }

          // this time we don't place an extra ball, but a block
          else {

            // if we don't have any block to recycle...
            if (this.recycledBlocks.length == 0) {

              // add a block
              this.addBlock(blockPosition * this.blockSize + this.blockSize / 2, this.emptySpace / 2 + (this.blockSize * .5) + r * this.blockSize, r, blockPosition, false, color, 1);

            }
            else {

              // recycle a block
              this.addBlock(blockPosition * this.blockSize + this.blockSize / 2, this.emptySpace / 2 + (this.blockSize * .5) + r * this.blockSize, r, blockPosition, true, color, 1);

              //this.addBlock(blockPosition * this.blockSize + this.blockSize / 2, this.blockSize / 2 + this.emptySpace / 2, r,true)
            }
          }
        }
      }
      this.events.emit('block');
    }

    //star
    let placeStar = Phaser.Math.Between(0, 100) < gameOptions.starProbability;
    if (placeStar && !this.starPlaced) {
      this.star.col = Phaser.Math.Between(0, gameOptions.blocksPerLine - 1)
      this.star.setPosition(this.blockSize / 2 + this.star.col * this.blockSize, this.emptySpace / 2 + this.blockSize / 2);
      this.starPlaced = true;
      this.star.body.enable = true

    }

  }
  addBlockLinePrefab() {
    for (var r = 0; r < rounds[round].prefab.length; r++) {
      var color = Phaser.Math.Between(0, 21)
      for (var c = 0; c < rounds[round].prefab[r].length; c++) {
        if (rounds[round].prefab[r][c] > 0) {

          this.addBlock(c * this.blockSize + this.blockSize / 2, this.emptySpace / 2 + (this.blockSize * .5) + (r + 1) * this.blockSize, r + 1, c, false, color, rounds[round].prefab[r][c]);
        }
      }
    }
  }
  // method to add a block at a given x,y position. The third argument tells us if the block is recycled
  addBlock(x, y, r, c, isRecycled, color, val) {
    blockCount++;
    if (val > 1) {
      var blockValue = val;
    } else {
      var blockValue = gameOptions.startingValue;
    }
    // block creation as a child of blockGroup
    let block = isRecycled ? this.recycledBlocks.shift() : this.blockGroup.create(x, y, "gems", 0);

    // resize the block

    block.displayWidth = this.blockSize;
    block.displayHeight = this.blockSize;
    block.setTint(blockColors[color])
    // custom property to save block value
    block.value = blockValue + this.level;
    block.isToggle = false;
    block.state = 'open';
    // custom property to save block row
    block.row = 1 + r;
    block.col = c;
    // if the block is recycled...
    if (isRecycled) {
      block.x = x;
      block.y = y;
      block.rowText.setText(block.row);
      block.text.setText(block.value);
      block.text.x = block.x;
      block.text.y = block.y;
      block.setVisible(true);
      block.text.setVisible(true);
      block.setFrame(0);
      this.blockGroup.add(block);

    }

    // if the block is not recycled...
    else {
      // text object to show block value
      let text = this.add.text(block.x, block.y, block.value, {
        font: "bold 32px Arial",
        align: "center",
        color: "#000000"
      });
      text.setOrigin(0.5);

      let textRow = this.add.text(block.x - 20, block.y + 20, block.row, {
        font: "bold 24px Arial",
        align: "center",
        color: "#000000"
      });
      textRow.setOrigin(0.5);


      // text object is stored as a block custom property
      block.text = text;
      block.rowText = textRow;
      /*
      let text2 = this.add.text(block.x-15, block.y+15, block.row, {
        font: "bold 28px Arial",
        align: "center",
        color: "#000000"
      });
      text2.setOrigin(0.5);

      // text object is stored as a block custom property
      block.text2 = text2;*/


    }
    var tp = Phaser.Math.Between(0, 100);
    if (tp < gameOptions.toggleProbability && this.allowBlocked) {
      block.isToggle = true;
      block.setFrame(15)
    }
    // block is immovable, does not react to collisions
    block.body.immovable = true;
  }
  spawnSpecials() {
    for (var i = 0; i < this.specialArray.length; i++) {
      var special = this.specialArray.pop();
      if (this.recycledSpecials.length == 0) {
        this.addSpecial(special.x, special.y, special.row, special.col, false);
      } else {
        this.addSpecial(special.x, special.y, special.row, special.col, true);
      }
    }
  }
  addSpecial(x, y, r, c, isRecycled) {
    let stype = Phaser.Math.Between(7, 9);
    let special = isRecycled ? this.recycledSpecials.shift() : this.specialGroup.create(x, y, "gems", 7);
    // resize the block
    special.displayWidth = this.blockSize;
    special.displayHeight = this.blockSize;
    special.setFrame(stype);
    special.setCircle(this.blockSize / 2);
    // custom property to save block value

    if (isRecycled) {
      special.x = x;
      special.y = y;


      special.setVisible(true);

      this.specialGroup.add(special);
    }
    // custom property to save block row
    special.row = r;
    special.col = c;
    special.type = stype;
    special.hit = false;
  }
  // method to get the ball position
  getBallPosition() {

    // select gallGroup children
    let children = this.ballGroup.getChildren();

    // return x and y properties of first child
    return {
      x: children[0].x,
      y: children[0].y
    }
  }

  // method to add the trajectory sprite
  addTrajectory() {

    // get ball position
    let ballPosition = this.getBallPosition();

    // add trajectory sprite
    this.trajectory = this.add.sprite(ballPosition.x, ballPosition.y, "trajectory_2", 3);

    // set registration point to bottom center
    this.trajectory.setOrigin(0.5, 1);

    // hide sprite
    this.trajectory.setVisible(false);
  }

  // method to start aiming
  startAiming() {

    // are we waiting for player input?
    if (gameState == WAITING_FOR_PLAYER_INPUT) {

      // the angle of fire is not legal at the moment
      this.legalAngleOfFire = false;

      // change game state because now the player is aiming
      gameState = PLAYER_IS_AIMING;
      var ballX = this.getBallPosition().x;
      var ballY = this.getBallPosition().y;
      // place trajectory sprite over the ball
      this.trajectory.x = ballX;
      this.trajectory.y = ballY;


    }
  }

  // method to adjust the aim
  adjustAim(e) {

    // is the player aiming?
    if (gameState == PLAYER_IS_AIMING) {

      // determine x and y distance between current and initial input
      let distX = e.x - e.downX;
      let distY = e.y - e.downY;

      // is y distance greater than 10, that is: is the player dragging down?
      if (distY > 10) {

        // this is a legal agne of fire
        this.legalAngleOfFire = true;

        // show trajectory sprite
        this.trajectory.setVisible(true);

        // determine dragging direction
        this.direction = Phaser.Math.Angle.Between(e.x, e.y, e.downX, e.downY);

        // rotate trajectory sprite accordingly
        this.trajectory.angle = Phaser.Math.RadToDeg(this.direction) + 90;
      }

      // y distance is smaller than 10, that is: player is not dragging down
      else {

        // not a legal angle of fire
        this.legalAngleOfFire = false;

        // hide trajectory sprite
        this.trajectory.setVisible(false);
      }
    }
  }

  // method to shoot the ball
  shootBall() {

    // is the player aiming?
    if (gameState == PLAYER_IS_AIMING) {

      // hide trajectory sprite
      this.trajectory.setVisible(false);

      // do we have a legal angle of fire?
      if (this.legalAngleOfFire) {

        // change game state
        gameState = BALLS_ARE_RUNNING;

        // no balls have landed already
        this.landedBalls = 0;

        // adjust angle of fire
        let angleOfFire = Phaser.Math.DegToRad(this.trajectory.angle - 90);

        // iterate through all balls
        this.ballGroup.getChildren().forEach(function (ball, index) {

          // add a timer event which fires a ball every 0.1 seconds
          this.time.addEvent({
            delay: 100 * index,
            callback: function () {

              // set ball velocity
              ball.body.setVelocity(gameOptions.ballSpeed * Math.cos(angleOfFire), gameOptions.ballSpeed * Math.sin(angleOfFire));
            }
          });
        }.bind(this))
      }

      // we don't have a legal angle of fire
      else {

        // let's wait for player input again
        gameState = WAITING_FOR_PLAYER_INPUT;
      }
    }
  }

  // method to check collision between a ball and the bounds
  checkBoundCollision(ball, up, down, left, right) {

    // we only want to check lower bound and only if balls are running
    if (down && !this.bouncePU && gameState == BALLS_ARE_RUNNING) {

      // stop the ball
      ball.setVelocity(0);

      // increase the amount of landed balls
      this.landedBalls++;

      // if this is the first landed ball...
      if (this.landedBalls == 1) {

        // save the ball in firstBallToLand variable
        this.firstBallToLand = ball;
      }
    } else if (down && this.bouncePU && gameState == BALLS_ARE_RUNNING) {
      this.bouncePULanded++
      if (this.bouncePULanded == this.ballGroup.getLength() * 2) {
        this.bouncePU = false;
        this.bottomPanel.setTint(0x222222)
      }
      // this.ballGroup.getLength() * 2
    }
  }

  // method to be executed at each frame
  update() {

    // if Arcade physics is updating or balls are running and all balls have landed...
    if ((gameState == ARCADE_PHYSICS_IS_UPDATING) || gameState == BALLS_ARE_RUNNING && this.landedBalls == this.ballGroup.getChildren().length) {

      // if the game state is still set to BALLS_ARE_RUNNING...
      if (gameState == BALLS_ARE_RUNNING) {

        // ... basically wait a frame to let Arcade physics update body positions
        gameState = ARCADE_PHYSICS_IS_UPDATING;
      }

      // if Arcade already updated body positions...
      else {

        // time to prepare for next move
        gameState = PREPARING_FOR_NEXT_MOVE;
        if (blockCount == 0 && gameMode == 'puzzle') {
          // ...restart the game


          // fade to black
          this.cameras.main.fadeOut(1000, 0, 0, 0)
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.pause("UI");
            this.scene.pause("PlayGame");
            this.scene.launch("endGame", { outcome: 'win', level: this.level });

          })




        }
        this.bombPU = false;
        if (this.specialArray.length > 0) {
          this.spawnSpecials();
        }
        if (this.level % 10 == 0) {
          this.changeBG();
        }

        // move the blocks
        this.moveBlocks();

        // move the balls
        this.moveBalls();

        // move the extra balls
        this.moveExtraBalls();
      }
    }

    // if balls are running...
    if (gameState == BALLS_ARE_RUNNING) {

      // handle collisions between balls and blocks
      this.handleBallVsBlock();

      // handle collisions between ball and extra balls
      this.handleBallVsExtra();

      if (this.starPlaced) {
        this.handleBallVsStar();
      }
      this.handleBallVsSpecial();
    }
  }

  // method to move all blocks down a row
  moveBlocks() {
    this.moveSpecials();
    // we will move blocks with a tween
    this.tweens.add({

      // we set all blocks as tween target
      targets: this.blockGroup.getChildren(),

      // which properties are we going to tween?
      props: {

        // y property
        y: {

          // each block is moved down from its position by its display height
          getEnd: function (target) {
            return target.y + target.displayHeight;
          }
        },
      },

      // scope of callback function
      callbackScope: this,

      // each time the tween updates...
      onUpdate: function (tween, target) {

        // tween down the value text too
        target.text.y = target.y;
        target.rowText.y = target.y + 20;
      },

      // once the tween completes...
      onComplete: function () {
        if (this.starPlaced) {
          this.moveStar();
        }
        // wait for player input again
        gameState = WAITING_FOR_PLAYER_INPUT;

        // execute an action on all blocks
        Phaser.Actions.Call(this.blockGroup.getChildren(), function (block) {

          // update row custom property
          block.row++;
          block.rowText.setText(block.row)
          if (block.isToggle) {
            if (block.state == 'open') {
              block.state = 'closed';
              block.setFrame(14)
            } else {
              block.state = 'open';
              block.setFrame(15)
            }

          }
          // if a block reached the bottom of the game area...
          if (block.row == gameOptions.blockLines) {

            // ... it's game over
            this.gameOver = true;
          }
        }, this);

        // if it's not game over...
        if (!this.gameOver) {

          // add another block line
          if (this.level < gameOptions.levelGoal) {
            this.addBlockLine(1);
          }

        }

        // if it's game over...
        else {

          // ...restart the game
          //this.scene.start("UI");
          //this.scene.start("PlayGame");
          // fade to black
          this.cameras.main.fadeOut(1000, 0, 0, 0)
          this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            this.scene.pause("UI");
            this.scene.pause("PlayGame");
            this.scene.launch("endGame", { outcome: 'lose', level: this.level });

          })
        }
      },

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }






  moveSpecials() {

    // we will move blocks with a tween
    this.tweens.add({
      // we set all blocks as tween target
      targets: this.specialGroup.getChildren(),

      // which properties are we going to tween?
      props: {

        // y property
        y: {

          // each block is moved down from its position by its display height
          getEnd: function (target) {
            return target.y + target.displayHeight;
          }
        },
      },

      // scope of callback function
      callbackScope: this,

      // once the tween completes...
      onComplete: function () {

        // execute an action on all blocks
        Phaser.Actions.Call(this.specialGroup.getChildren(), function (special) {
          // update row custom property
          special.row++;
          if (special.hit || special.row == gameOptions.blockLines - 1) {

            // push block into recycledBlocks array
            this.recycledSpecials.push(special);
            // remove the block from blockGroup
            this.specialGroup.remove(special);
            // hide the block
            special.visible = false;
          }
        }, this);

      },

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }









  moveStar() {
    this.star.col++;

    if (this.star.col == gameOptions.blocksPerLine) {
      // this.star.setAlpha(.5)
      this.starPlaced = false;
    }
    var tween = this.tweens.add({
      targets: this.star,
      x: this.blockSize / 2 + this.star.col * this.blockSize,
      duration: 300,
    })

  }
  moveBlocksUp() {

    // we will move blocks with a tween
    this.tweens.add({

      // we set all blocks as tween target
      targets: this.blockGroup.getChildren(),

      // which properties are we going to tween?
      props: {

        // y property
        y: {

          // each block is moved down from its position by its display height
          getEnd: function (target) {
            return target.y - target.displayHeight;
          }
        },
      },

      // scope of callback function
      callbackScope: this,

      // each time the tween updates...
      onUpdate: function (tween, target) {
        this.removeBlockLine(2)
        // tween down the value text too
        target.text.y = target.y;
        target.rowText.y = target.y + 20;
      },

      // once the tween completes...
      onComplete: function () {

        // wait for player input again
        //this.gameState = WAITING_FOR_PLAYER_INPUT;

        // execute an action on all blocks
        Phaser.Actions.Call(this.blockGroup.getChildren(), function (block) {

          // update row custom property
          block.row--;

          // if a block reached the bottom of the game area...
          if (block.row == gameOptions.blockLines) {

            // ... it's game over
            this.gameOver = true;
          }
        }, this);

        // if it's not game over...
        if (!this.gameOver) {

          // add another block line
          //  this.addBlockLine(1);
        }

        // if it's game over...
        else {

          // ...restart the game
          this.scene.start("PlayGame");
        }
      },

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }
  removeBlockLine(line) {
    Phaser.Actions.Call(this.blockGroup.getChildren(), function (block) {

      // if a block reached the bottom of the game area...
      if (block.row == line) {
        this.recycledBlocks.push(block);
        blockCount--;
        // remove the block from blockGroup
        this.blockGroup.remove(block);

        // hide the block
        block.visible = false;

        // hide block text
        block.text.visible = false;


      }
    }, this);

  }
  // method to move all balls to first landed ball position
  moveBalls() {

    // we will move balls with a tween
    this.tweens.add({

      // we set all balls as tween target
      targets: this.ballGroup.getChildren(),

      // set x to match the horizontal position of the first landed ball
      x: this.firstBallToLand.gameObject.x,

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }

  // method to move all extra balls
  moveExtraBalls() {

    // execute an action on all extra balls
    Phaser.Actions.Call(this.extraBallGroup.getChildren(), function (ball) {

      // if a ball reached the bottom of the game field...
      if (ball.row == gameOptions.blockLines) {

        // set it as "collected"
        ball.collected = true;
      }
    })

    // we will move balls with a tween
    this.tweens.add({

      // we set all extra balls as tween target
      targets: this.extraBallGroup.getChildren(),

      // which properties are we going to tween?
      props: {

        // x property
        x: {

          getEnd: function (target) {

            // is the ball marked as collected?
            if (target.collected) {

              // set x to match the horizontal position of the first landed ball
              return target.scene.firstBallToLand.gameObject.x;
            }

            // ... or leave it in its place
            return target.x;
          }
        },

        // same thing with y position
        y: {
          getEnd: function (target) {
            if (target.collected) {
              return target.scene.firstBallToLand.gameObject.y;
            }
            return target.y + target.scene.blockSize;
          }
        },
      },

      // scope of callback function
      callbackScope: this,

      // once the tween completes...
      onComplete: function () {

        // execute an action on all extra balls
        Phaser.Actions.Call(this.extraBallGroup.getChildren(), function (ball) {

          // if the ball is not collected...
          if (!ball.collected) {

            // ... increase its row property
            ball.row++;
          }

          // if the ball has been collected...
          else {

            // remove the ball from extra ball group
            this.extraBallGroup.remove(ball);
            ball.clearTint();
            // add the ball to ball group
            this.ballGroup.add(ball);

            // set extra ball properties
            ball.body.collideWorldBounds = true;
            ball.body.onWorldBounds = true;
            ball.body.setBounce(1, 1);
          }
        }, this);
      },

      // tween duration, 1/2 second
      duration: 500,

      // tween easing
      ease: "Cubic.easeInOut"
    });
  }

  // method to handle collision between a ball and a block
  handleBallVsBlock() {


    // check collision between ballGroup and blockGroup members
    this.physics.world.collide(this.ballGroup, this.blockGroup, function (ball, block) {

      // decrease block value
      if (block.state == 'open') {
        if (this.doublePU) {
          block.value -= 2;
        } else {
          block.value--;
        }
      } else if (block.state == 'closed' && this.bombPU) {
        if (this.doublePU) {
          block.value -= 2;
        } else {
          block.value--;
        }
      }

      // if block value reaches zero...
      if (block.value <= 0) {
        blockCount--;
        this.destroyBlockTween(block.x, block.y)
        var num = Phaser.Math.Between(0, 100);
        if (num < gameOptions.spawnSpecialProbability) {
          var xy = { x: block.x, y: block.y, row: block.row, col: block.col };
          this.specialArray.push(xy);
        }
        // push block into recycledBlocks array
        this.recycledBlocks.push(block);

        // remove the block from blockGroup
        this.blockGroup.remove(block);

        // hide the block
        block.visible = false;

        // hide block text
        block.text.visible = false;
        block.rowText.visible = false;
      }

      // if block value does not reach zero...
      else {

        // update block text
        block.text.setText(block.value);
      }
    }, null, this);
  }
  decreaseRow(row) {
    Phaser.Actions.Call(this.blockGroup.getChildren(), function (block) {
      if (block.row == row) {
        // decrease block value
        if (block.state == 'open') {
          if (this.doublePU) {
            block.value -= 2;
          } else {
            block.value--;
          }
        } else if (block.state == 'closed' && this.bombPU) {
          if (this.doublePU) {
            block.value -= 2;
          } else {
            block.value--;
          }
        }


        // if block value reaches zero...
        if (block.value <= 0) {
          this.destroyBlockTween(block.x, block.y);
          blockCount--;
          // push block into recycledBlocks array
          this.recycledBlocks.push(block);

          // remove the block from blockGroup
          this.blockGroup.remove(block);

          // hide the block
          block.visible = false;

          // hide block text
          block.text.visible = false;
        }

        // if block value does not reach zero...
        else {

          // update block text
          block.text.setText(block.value);
        }

      }
    }, this);
  }
  decreaseCol(col) {
    Phaser.Actions.Call(this.blockGroup.getChildren(), function (block) {
      if (block.col == col) {
        // decrease block value
        if (block.state == 'open') {
          if (this.doublePU) {
            block.value -= 2;
          } else {
            block.value--;
          }
        } else if (block.state == 'closed' && this.bombPU) {
          if (this.doublePU) {
            block.value -= 2;
          } else {
            block.value--;
          }
        }


        // if block value reaches zero...
        if (block.value <= 0) {
          this.destroyBlockTween(block.x, block.y)
          blockCount--;
          // push block into recycledBlocks array
          this.recycledBlocks.push(block);

          // remove the block from blockGroup
          this.blockGroup.remove(block);

          // hide the block
          block.visible = false;

          // hide block text
          block.text.visible = false;
        }

        // if block value does not reach zero...
        else {

          // update block text
          block.text.setText(block.value);
        }

      }
    }, this);
  }
  // method to handle collision between a ball and an extra ball
  handleBallVsExtra() {

    // check overlap between ballGroup and extraBallGroup members
    this.physics.world.overlap(this.ballGroup, this.extraBallGroup, function (ball, extraBall) {

      // set extra ball as collected
      extraBall.collected = true;

      // add a tween to move the ball down
      this.tweens.add({

        // the target is the extra ball
        targets: extraBall,

        // y destination position is the very bottom of game area
        y: game.config.height - this.bottomPanel.displayHeight - extraBall.displayHeight / 2,

        // tween duration, 0.2 seconds
        duration: 200,

        // tween easing
        ease: "Cubic.easeOut"
      });
    }, null, this);
  }
  handleBallVsStar() {
    this.physics.world.overlap(this.ballGroup, this.star, function (ball, star) {
      this.star.body.enable = false;
      this.starPlaced = false
      this.starCount++
      this.events.emit('star', { star: this.starCount });
      // add a tween to move the ball down
      this.tweens.add({

        // the target is the extra ball
        targets: this.star,

        // y destination position is the very bottom of game area
        y: -100,
        angle: 360,
        // tween duration, 0.2 seconds
        duration: 800,

        // tween easing
        ease: "Cubic.easeOut"
      });
    }, null, this);
  }
  handleBallVsSpecial() {
    this.physics.world.overlap(this.ballGroup, this.specialGroup, function (ball, special) {
      special.hit = true;
      if (special.type == 9) {
        if (this.mark == 0) {
          var vx = 501
          this.mark = 1
        } else {
          var vx = -498
          this.mark = 0
        }
        ball.setVelocity(vx, -1000);
      } else if (special.type == 8) {
        if (this.mark == 0) {
          this.decreaseRow(special.row);
          this.mark = 1
        } else {

          this.mark = 0
        }
      } else if (special.type == 7) {
        if (this.mark == 0) {
          this.decreaseCol(special.col);
          this.mark = 1
        } else {

          this.mark = 0
        }
      }
    }, null, this);
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
        start: 4,
        end: 0
      },
      // particle alpha: from opaque to transparent
      alpha: {
        start: 1,
        end: 0
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

var runRaycaster = function (raycaster, x, y, angle, debugGraphics) {
  debugGraphics
    .clear()
    .fillStyle(0xC4C400)
    .fillCircle(x, y, 10);

  const MaxRaycasterCount = 1000;
  for (var i = 0; i < MaxRaycasterCount; i++) {
    var result = raycaster.rayToward(x, y, angle);
    debugGraphics
      .lineStyle(2, 0x840000)
      .strokeLineShape(raycaster.ray);

    if (result) {
      debugGraphics
        .fillStyle(0xff0000)
        .fillPoint(result.x, result.y, 4)

      x = result.x;
      y = result.y;
      angle = result.reflectAngle;
    } else {
      break;
    }
  }
}
