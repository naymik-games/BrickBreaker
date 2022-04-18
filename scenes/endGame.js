class endGame extends Phaser.Scene {
	constructor() {
		super("endGame");
	}
	init(data) {
		this.outcome = data.outcome;
		this.level = data.level;
	}
	preload() {

	}
	create() {
		//this.scene.start("PlayGame");
		//this.scene.start("UI");
		this.titleText = this.add.bitmapText(game.config.width / 2, 350, 'lato', 'Game Over', 100).setOrigin(.5);
		if (gameMode == 'puzzle') {
			gameData.onRound = round
			if (this.outcome == 'lose') {
				var mess = 'You Lose!';
			} else {
				var mess = 'You Win!';
			}
		} else {
			var mess = ''
		}

		this.outcomeText = this.add.bitmapText(game.config.width / 2, 450, 'lato', mess, 80).setOrigin(.5);


		if (gameMode == 'puzzle') {
			this.nextPuzzleText = this.add.bitmapText(game.config.width / 2, 750, 'lato', 'Next Puzzle', 60).setOrigin(.5).setInteractive();
		}


		if (gameMode == 'puzzle') {
			if (this.outcome == 'win') {
				var ro = round + 1
				this.levelText = this.add.bitmapText(game.config.width / 2, 550, 'lato', 'Round: ' + ro, 80).setOrigin(.5);
				gameData.levelStatus[round] = 2;
				this.saveSettings();
			} else {

			}
		} else {
			if (gameMode == 'easy') {
				if (this.level > gameData.bestEasy) {
					gameData.bestEasy = this.level;
					gameData.lastEasy = this.level
					this.newHighText = this.add.bitmapText(game.config.width / 2, 650, 'lato', 'New High', 80).setOrigin(.5).setTint(0xffffff);

				} else {
					gameData.lastEasy = this.level
				}
				this.saveSettings();
				this.levelText = this.add.bitmapText(game.config.width / 2, 750, 'lato', this.level, 80).setOrigin(.5);
				this.highText = this.add.bitmapText(game.config.width / 2, 850, 'lato', gameData.bestEasy, 80).setOrigin(.5).setTint(0xff0000);
			} else {
				if (this.level > gameData.best) {
					gameData.best = this.level;
					gameData.last = this.level
					this.newHighText = this.add.bitmapText(game.config.width / 2, 450, 'lato', 'New High', 80).setOrigin(.5).setTint(0xffffff);

				} else {
					gameData.last = this.level
				}
				this.saveSettings();
				this.levelText = this.add.bitmapText(game.config.width / 2, 450, 'lato', 'Now: ' + this.level, 80).setOrigin(.5);
				this.highText = this.add.bitmapText(game.config.width / 2, 550, 'lato', 'Best: ' + gameData.best, 80).setOrigin(.5).setTint(0xff0000);
			}
		}

		this.homeText = this.add.bitmapText(game.config.width / 2, 1000, 'lato', 'Home', 60).setOrigin(.5).setInteractive();
		this.normalText = this.add.bitmapText(game.config.width / 2, 1100, 'lato', 'Classic', 60).setOrigin(.5).setInteractive();
		this.easyText = this.add.bitmapText(game.config.width / 2, 1200, 'lato', 'Easy', 60).setOrigin(.5).setInteractive();
		this.puzzleText = this.add.bitmapText(game.config.width / 2, 1300, 'lato', 'Select Puzzle', 60).setOrigin(.5).setInteractive();


		this.homeText.on('pointerdown', function () {
			this.scene.stop('UI');
			this.scene.stop('PlayGame');
			this.scene.stop();
			this.scene.start("startGame");
		}, this);

		this.normalText.on('pointerdown', function () {
			this.scene.start("PlayGame");
			this.scene.start("UI");
			gameMode = 'normal';
		}, this);
		this.easyText.on('pointerdown', function () {
			this.scene.start("PlayGame");
			this.scene.start("UI");
			gameMode = 'easy';
		}, this);
		this.puzzleText.on('pointerdown', function () {
			this.scene.stop('UI');
			this.scene.stop('PlayGame');
			this.scene.stop();
			this.scene.start("selectGame");

		}, this);
		if (gameMode == 'puzzle') {
			this.nextPuzzleText.on('pointerdown', function () {
				this.scene.start("PlayGame");
				this.scene.start("UI");
				round++
				gameMode = 'puzzle';
			}, this);
		}
	}
	saveSettings() {
		localStorage.setItem('ballzPuzzleData', JSON.stringify(gameData));
	}

}