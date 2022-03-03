class preloadGame extends Phaser.Scene {
  constructor() {
    super("PreloadGame");
  }
  preload() {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    var width = this.cameras.main.width;
    var height = this.cameras.main.height;
    var loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        fill: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    var percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: '0%',
      style: {
        font: '18px monospace',
        fill: '#ffffff'
      }
    });
    percentText.setOrigin(0.5, 0.5);

    var assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '22px monospace',
        fill: '#ffffff'
      }
    });

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', function(value) {
      percentText.setText(parseInt(value * 100) + '%');
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    this.load.on('fileprogress', function(file) {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', function() {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
    });

    this.load.image("panel", "assets/sprites/blank.png");
    for (var i = 0; i < 425; i++) {
      this.load.image("panel", "assets/sprites/blank.png");

    }
    this.load.bitmapFont('lato', 'assets/fonts/lato_0.png', 'assets/fonts/lato.xml');

        
	this.load.image("panel2", "assets/sprites/blank_2.png");
    //this.load.image("trajectory", "assets/sprites/trajectory.png");
    this.load.image("block", "assets/sprites/block.png");
   this.load.image("ball", "assets/sprites/ball.png");

    this.load.spritesheet("trajectory", "assets/sprites/trajectory.png", { frameWidth: 40, frameHeight: 600 });
 this.load.spritesheet("trajectory_2", "assets/sprites/trajectory_2.png", { frameWidth: 40, frameHeight: 1600 });
    this.load.spritesheet("gems", "assets/sprites/gems.png", {
      frameWidth: 100,
      frameHeight: 100,
	  spacing: 2,
	  margin:2
    });
	 this.load.spritesheet("icons", "assets/sprites/icons.png", {
      frameWidth: 96,
      frameHeight: 96
    });
    this.load.spritesheet("particles", "assets/particles.png", {
		  frameWidth: 6,
		  frameHeight: 6
		});
}
  create() {
	 this.scene.start("startGame");
    //this.scene.start("PlayGame");
    //this.scene.start("UI");
  }
}