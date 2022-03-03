var  levelOptions = {

    colors: ["0xffffff","0xff0000","0x00ff00","0x0000ff","0xffff00"],

	numPages: 3,
    columns: 7,
    rows: 7,
    thumbWidth: 100,
    thumbHeight: 100,
    spacing: 10,
    localStorageName: "levelselect"
}
	  

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
	
	
	
	
	        this.stars = [];
        this.stars[0] = 0;
        this.canMove = true;
        this.itemGroup = this.add.group();
        
        
        this.pageText = this.add.text(game.config.width / 2, 300, "Swipe to select level page (1 / " +  levelOptions.numPages + ")", {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });
        this.pageText.setOrigin(0.5).setDepth(2);
        this.scrollingMap = this.add.tileSprite(0, 0,  levelOptions.numPages * game.config.width, game.config.height, "panel").setTint(0x000000);
        this.scrollingMap.setInteractive();
        this.input.setDraggable(this.scrollingMap);
        this.scrollingMap.setOrigin(0, 0);
        this.currentPage = 0;
        this.pageSelectors = [];
        var rowLength =  levelOptions.thumbWidth *  levelOptions.columns +  levelOptions.spacing * ( levelOptions.columns - 1);
        var leftMargin = (game.config.width - rowLength) / 2 +  levelOptions.thumbWidth / 2;
        var colHeight =  levelOptions.thumbHeight *  levelOptions.rows +  levelOptions.spacing * ( levelOptions.rows - 1);
        var topMargin = (game.config.height - colHeight) / 2 +  levelOptions.thumbHeight / 2;
        for(var k = 0; k <  levelOptions.numPages; k++){
            for(var i = 0; i <  levelOptions.columns; i++){
                for(var j = 0; j <  levelOptions.rows; j++){
                    var thumb = this.add.image(k * game.config.width + leftMargin + i * ( levelOptions.thumbWidth +  levelOptions.spacing), topMargin + j * ( levelOptions.thumbHeight +  levelOptions.spacing), "gems", 2);
                    //thumb.setTint( levelOptions.colors[k]);
					thumb.displayWidth = levelOptions.thumbWidth;
					thumb.displayHeight = levelOptions.thumbHeight;
                    thumb.levelNumber = k * ( levelOptions.rows *  levelOptions.columns) + j *  levelOptions.columns + i;
                      if(thumb.levelNumber < rounds.length){
					  var rd = thumb.levelNumber + 1;
					  var blockText = this.add.bitmapText(thumb.x, thumb.y, 'lato', rd, 60).setOrigin(.5);
					  thumb.round = thumb.levelNumber;
					  if (gameData.levelStatus[thumb.levelNumber] == 2){
						  thumb.setFrame(2);
					  } else if (gameData.levelStatus[thumb.levelNumber] == 1){
						  thumb.setFrame(1);
					  } else if (gameData.levelStatus[thumb.levelNumber] == 0){
						  thumb.setFrame(5);
					  }
					} else {
					  thumb.round = -1;
					  thumb.setFrame(5);
					}
                    this.itemGroup.add(thumb);
                    
                    this.itemGroup.add(blockText);
                }
            }
            this.pageSelectors[k] = this.add.sprite(game.config.width / 2 + (k - Math.floor( levelOptions.numPages / 2) + 0.5 * (1 -  levelOptions.numPages % 2)) * 200, game.config.height - 200, "panel");
            this.pageSelectors[k].setInteractive();
            this.pageSelectors[k].on("pointerdown", function(){
                if(this.scene.canMove){
                    var difference = this.pageIndex - this.scene.currentPage;
                    this.scene.changePage(difference);
                    this.scene.canMove = false;
                }
            });
            this.pageSelectors[k].pageIndex = k;
            //this.pageSelectors[k].tint =  levelOptions.colors[k];
            if(k == this.currentPage){
                this.pageSelectors[k].scaleY = 1;
            }
            else{
                this.pageSelectors[k].scaleY = 0.5;
            }
        }
        this.input.on("dragstart", function(pointer, gameObject){
            gameObject.startPosition = gameObject.x;
            gameObject.currentPosition = gameObject.x;
        });
        this.input.on("drag", function(pointer, gameObject, dragX, dragY){
            if(dragX <= 10 && dragX >= -gameObject.width + game.config.width - 10){
                gameObject.x = dragX;
                var delta = gameObject.x - gameObject.currentPosition;
                gameObject.currentPosition = dragX;
                this.itemGroup.children.iterate(function(item){
                    item.x += delta;
                });
            }
        }, this);
        this.input.on("dragend", function(pointer, gameObject){
            this.canMove = false;
            var delta = gameObject.startPosition - gameObject.x;
            if(delta == 0){
                this.canMove = true;
                this.itemGroup.children.iterate(function(item){
                    if(item.round > -1){
                        var boundingBox = item.getBounds();
                        if(Phaser.Geom.Rectangle.Contains(boundingBox, pointer.x, pointer.y)){ //&& item.frame.name > 0
									 this.scene.start("PlayGame");

								  this.scene.start("UI");

								  gameMode = 'puzzle';
								  round = item.round;
								  gameData.onRound = round;
									if(gameData.levelStatus[round] == 0){
										gameData.levelStatus[round] = 1;
									}
								this.saveSettings();
                        }
                    }
                }, this);
            }
            if(delta > game.config.width / 8){
                this.changePage(1);
            }
            else{
                if(delta < -game.config.width / 8){
                    this.changePage(-1);
                }
                else{
                    this.changePage(0);
                }
            }
        }, this);
  
    
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	this.titleText = this.add.bitmapText(game.config.width / 2, 150, 'lato', 'Select Puzzle', 130).setOrigin(.5);

	
	
	
	this.homeText = this.add.bitmapText(game.config.width / 2, 1550, 'lato', 'Home', 60).setOrigin(.5).setInteractive();

	this.homeText.on('pointerdown', function(){
		this.scene.stop();
		this.scene.start("startGame");
	}, this);
	
	
	
	this.input.on('gameobjectdown', this.click, this);
  }
  
  
  changePage(page){
        this.currentPage += page;
        for(var k = 0; k <  levelOptions.numPages; k++){
            if(k == this.currentPage){
                this.pageSelectors[k].scaleY = 1;
            }
            else{
                this.pageSelectors[k].scaleY = 0.5;
            }
        }
        this.pageText.text = "Swipe to select level page (" + (this.currentPage + 1).toString() + " / " +  levelOptions.colors.length + ")";
        var currentPosition = this.scrollingMap.x;
        this.tweens.add({
            targets: this.scrollingMap,
            x: this.currentPage * -game.config.width,
            duration: 300,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onUpdate: function(tween, target){
                var delta = target.x - currentPosition;
                currentPosition = target.x;
                this.itemGroup.children.iterate(function(item){
                    item.x += delta;
                });
            },
            onComplete: function(){
                this.canMove = true;
            }
        });
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