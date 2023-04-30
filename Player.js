export default class Player {
    rightPressed = false;
    leftPressed = false;
    upPressed = false;
    downPressed = false;
    shootPressed = false;

    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas;
        this.velocity = velocity;
        this.bulletController = bulletController;
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 75;
        this.width = 100;
        this.height = 96;
        this.image = new Image();

        // this.image.src = "images/player.png";
        //this.image.src = "resources/sounds/player.png";
        this.image.src = "";

        document.addEventListener("keydown", this.keydown);
        document.addEventListener("keyup", this.keyup);
    }

    draw = (ctx) => {
        if (this.shootPressed) {
            this.bulletController.shoot(this.x + this.width / 2, this.y, 4, 10);
        }
        this.move();
        this.collideWithWalls();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    setImage = (imageSRC) => {
        this.image.src = imageSRC;
    }


    collideWithWalls=()=> {
        //left
        if (this.x < 0) {
            this.x = 0;
        }

        //right
        if (this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        }

        //up
        if (this.y > this.canvas.height - this.height) {
            this.y = this.canvas.height - this.height;
        }
        //down - player can move 40% in the screen
        if (this.y < 450) {
            this.y = 450;
        }
    }

    move() {
        if (this.rightPressed) {
            this.x += this.velocity;
        } else if (this.leftPressed) {
            this.x += -this.velocity;
        }

        //    me
        if (this.upPressed) {
            this.y += -this.velocity;
        }
        if (this.downPressed) {
            this.y += this.velocity;
        }

    }

    keydown = (event) => {
        if (event.code === "ArrowRight") {
            this.rightPressed = true;
        }
        if (event.code === "ArrowLeft") {
            this.leftPressed = true;
        }
        if (event.code === "Space") {
            this.shootPressed = true;
        }

        //me
        if (event.code === "ArrowUp") {
            this.upPressed = true;
        }
        if (event.code === "ArrowDown") {
            this.downPressed = true;
        }
    };

    keyup = (event) => {
        if (event.code === "ArrowRight") {
            this.rightPressed = false;
        }
        if (event.code === "ArrowLeft") {
            this.leftPressed = false;
        }
        if (event.code === "Space") {
            this.shootPressed = false;
        }

        //    me
        if (event.code === "ArrowUp") {
            this.upPressed = false;
        }
        if (event.code === "ArrowDown") {
            this.downPressed = false;
        }
    };
}
