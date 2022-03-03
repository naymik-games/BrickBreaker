class startGame extends Phaser.Scene {
  constructor() {
    super("startGame");
  }
  preload() {

  }
  create() {
	  gameData = JSON.parse(localStorage.getItem('ballzPuzzleData'));

    if (gameData === null || gameData.length <= 0) {
      localStorage.setItem('ballzPuzzleData',
        JSON.stringify(defaultData));
      gameData = defaultData;
    }
    //this.scene.start("PlayGame");
    //this.scene.start("UI");
    
 this.physics.world.setBounds(0, 0, game.config.width, game.config.height);
   
 
	this.titleText = this.add.bitmapText(game.config.width / 2, 150, 'lato', 'BALLZ', 130).setOrigin(.5);
	
	this.normalText = this.add.bitmapText(game.config.width / 2, 450, 'lato', 'Classic', 90).setOrigin(.5).setInteractive();
	this.highText = this.add.bitmapText(game.config.width / 2, 525, 'lato', 'Best: ' + gameData.best, 50).setOrigin(.5).setInteractive().setTint(0xff0000);
this.easyText = this.add.bitmapText(game.config.width / 2, 650, 'lato', 'Easy', 90).setOrigin(.5).setInteractive();

	this.easyTextHigh = this.add.bitmapText(game.config.width / 2, 725, 'lato', 'Best: ' + gameData.bestEasy, 50).setOrigin(.5).setInteractive().setTint(0xff0000);

	
	this.puzzleText = this.add.bitmapText(game.config.width / 2, 850, 'lato', 'Puzzle', 90).setOrigin(.5).setInteractive();
	
	this.normalText.on('pointerdown', function(){
		this.scene.start("PlayGame");
		this.scene.start("UI");
		gameMode = 'normal';
	}, this);
	this.easyText.on('pointerdown', function(){

		this.scene.start("PlayGame");

		this.scene.start("UI");
		gameMode = 'easy';
	}, this);
	this.puzzleText.on('pointerdown', function(){
		
		  this.time.delayedCall(500, () => {
		    this.scene.start('selectGame')
		  })
		
	}, this);
	
	var ball = this.physics.add.image(450, 1200, 'ball');
	ball.body.setBounce(1, 1);
	ball.body.collideWorldBounds = true;
	ball.body.setVelocity(1000, 1000);
	
	var ball2 = this.physics.add.image(750, 1000, 'ball');
	ball2.body.setBounce(1, 1);
	ball2.body.collideWorldBounds = true;
	ball2.body.setVelocity(1000, -1000);
	
  }
  
}