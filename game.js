var config = {
    type: Phaser.AUTO,
    width: 1080,
    height: 5760,
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        key: 'mainScene',
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var joystick;

var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'sky.png');
    this.load.image('dude', 'soldier.png');
}

function create() {
    // Add background image
    let bg = this.add.image(0, 0, 'sky').setOrigin(0, 0).setScale(1);


    // Set camera bounds based on the whole world
    this.physics.world.setBounds(0, 0, bg.displayWidth * bg.scaleX, bg.displayHeight * bg.scaleY);

    // Set up player at the bottom center
    player = this.physics.add.sprite(config.width / 2, config.height - 20, 'dude');
    player.setCollideWorldBounds(true);
    player.setScale(0.4);
    player.body.gravity.y = 0;

    // Create a simple joystick object
    joystick = this.add.circle(400, config.height - 150, 50, 0x888888);
    joystick.setInteractive();
    this.input.setDraggable(joystick);

    // Set up camera to follow the player
    this.cameras.main.setBounds(0, 0, config.width, config.height);
    this.cameras.main.startFollow(player, true, 1, 1);

    // Add event listeners for drag start and end
    this.input.on('dragstart', function (pointer, gameObject) {
        joystick.isBeingDragged = true;
    });

    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        joystick.x = dragX;
        joystick.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject) {
        joystick.isBeingDragged = false;
        joystick.x = joystick.originalX;
        joystick.y = joystick.originalY;
    });

    // Store the original position of the joystick
   joystick.originalX = this.cameras.main.worldView.left + 150;
        joystick.originalY = this.cameras.main.worldView.bottom - 150;


}

function update() {
    // Check if the joystick is being dragged
    if (joystick.isBeingDragged) {
        // Calculate the direction based on the joystick's position
        var angle = Phaser.Math.Angle.Between(joystick.originalX, joystick.originalY, joystick.x, joystick.y);
        var speed = 150;

        // Move the player based on the joystick's angle
        player.setVelocityX(speed * Math.cos(angle));
        player.setVelocityY(speed * Math.sin(angle));
    } else {
        // If the joystick is not being dragged, stop the player
        player.setVelocity(0);
    }

       // Update the joystick position relative to the camera
        joystick.originalX = this.cameras.main.worldView.left + 400;
        joystick.originalY = this.cameras.main.worldView.bottom - 150;
}
