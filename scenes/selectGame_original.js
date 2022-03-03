class selectGame extends Phaser.Scene {

  constructor() {

    super("selectGame");
  }
  init(data) {
    this.outcome = data.outcome
  }
  preload() {

  }
  create() {
	
	  
	  
    //this.scene.start("PlayGame");
    //this.scene.start("UI");
	this.titleText = this.add.bitmapText(game.config.width / 2, 150, 'lato', 'Select Puzzle', 130).setOrigin(.5);
	
	
	for(var r = 0; r < 56; r++){
	  if(r < 7){
	    var x = r;
	    var y = 0;
	  } else if (r < 14){
	    var x = r -7;
	    var y = 1;
	  } else if (r < 21){
	    var x = r -14;
	    var y = 2;
	  } else if (r < 28){
	    var x = r -21;
	    var y = 3;
	  } else if (r < 35){
	    var x = r -28;
	    var y = 4;
	  } else if (r < 42){
	    var x = r -35;
	    var y = 5;
	  } else if (r < 49){
	    var x = r -42;
	    var y = 6;
	  } else if (r < 56){
	    var x = r -42;
	    var y = 7;
	  }
	  var block = this.add.image(75 + x * 125, 400 + y * 125, 'gems', 2).setInteractive();
	  
    if(r < rounds.length){
      var rd = r + 1;
	  var blockText = this.add.bitmapText(75 + x * 125, 400 + y * 125, 'lato', rd, 60).setOrigin(.5);
      block.round = r;
	  if (gameData.levelStatus[r] == 2){
		  block.setFrame(2);
	  } else if (gameData.levelStatus[r] == 1){
		  block.setFrame(1);
	  } else if (gameData.levelStatus[r] == 0){
		  block.setFrame(5);
	  }
    } else {
      block.round = -1;
	  block.setFrame(5);
    }
	
	}
	
	this.homeText = this.add.bitmapText(game.config.width / 2, 1550, 'lato', 'Home', 60).setOrigin(.5).setInteractive();

	this.homeText.on('pointerdown', function(){
		this.scene.stop();
		this.scene.start("startGame");
	}, this);
	
	
	
	this.input.on('gameobjectdown', this.click, this);
  }
  
  click(e, object){
    if(object.round >= 0){
    this.scene.start("PlayGame");

	  this.scene.start("UI");

	  gameMode = 'puzzle';
	  round = object.round;
	  gameData.onRound = round;
	    if(gameData.levelStatus[round] == 0){
			gameData.levelStatus[round] = 1;
		}
		this.saveSettings();
	  }
  }
  saveSettings() {
    localStorage.setItem('ballzPuzzleData', JSON.stringify(gameData));
  }
}