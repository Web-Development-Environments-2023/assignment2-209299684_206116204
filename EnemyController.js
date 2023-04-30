import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";

export default class EnemyController {
    enemyMap = [
        [20, 20, 20, 20, 20],
        [15, 15, 15, 15, 15],
        [10, 10, 10, 10, 10],
        [5, 5, 5, 5, 5],
    ];
    enemyRows = [];
    currentDirection = MovingDirection.right;
    xVelocity = 0;
    defaultXVelocity = 1;
    yVelocity = 0;
    defaultYVelocity = 1;
    score = 0;


    moveDownTimerDefault = 30
    moveDownTimer = this.moveDownTimerDefault

    fireBulletTimerDefault = 100;
    fireBulletTimer = this.fireBulletTimerDefault;

    constructor(canvas, enemyBulletController, playerBulletController) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;

        this.enemyDeathSound = new Audio('resources/sounds/enemyDeath.mp3')
        this.createEnemies()

    }
    setDefaultXVelocity (val){
        this.defaultXVelocity = 0
        this.defaultXVelocity = val

    }

    draw(ctx) {
        this.decrementMoveDownTimer()
        this.updateVelocityAndDirection()
        this.collisionDetection()
        this.drawEnemies(ctx)
        this.resetMoveDownTimer()
        this.fireBullet()
    }

    collisionDetection = () => {
        this.enemyRows.forEach((enemyRow) => {
            enemyRow.forEach((enemy, enemyIndex) => {
                if (this.playerBulletController.collideWith(enemy)) {
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                    this.score += enemy.imageNumber
                    enemyRow.splice(enemyIndex, 1);
                }
            });
        });
        this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0);
    }


    fireBullet() {
        this.fireBulletTimer--;
        if (this.fireBulletTimer <= 0) {
            this.fireBulletTimer = this.fireBulletTimerDefault;
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            this.enemyBulletController.shoot(enemy.x + enemy.width / 2, enemy.y, -3);
        }
    }

    //--------------- Move Down Functions ---------------
    resetMoveDownTimer = () => {
        if (this.moveDownTimer <= 0) {
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    decrementMoveDownTimer = () => {
        if (
            this.currentDirection === MovingDirection.downLeft ||
            this.currentDirection === MovingDirection.downRight
        ) {
            this.moveDownTimer--;
        }
    }

    drawEnemies = (ctx) => {
        this.enemyRows.flat().forEach((enemy) => {
            enemy.move(this.xVelocity, this.yVelocity)
            enemy.draw(ctx);
        })
    }

    moveDown = (newDirection) => {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if (this.moveDownTimer <= 0) {
            this.currentDirection = newDirection;
            return true;
        }
        return false;
    }

    //---------------------------------------------------

    updateVelocityAndDirection = () => {
        for (const enemyRow of this.enemyRows) {
            if (this.currentDirection == MovingDirection.right) {
                this.xVelocity = this.defaultXVelocity
                this.yVelocity = 0
                const rightMostEnemy = enemyRow[enemyRow.length - 1];
                if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width) {
                    this.currentDirection = MovingDirection.downLeft
                    break;
                }
            } else if (this.currentDirection === MovingDirection.downLeft) {
                this.xVelocity = 0
                this.yVelocity = this.defaultYVelocity
                if (this.moveDown(MovingDirection.left)) {
                    break;
                }
            } else if (this.currentDirection === MovingDirection.left) {
                this.xVelocity = -this.defaultXVelocity
                this.yVelocity = 0
                const leftMostEnemy = enemyRow[0];
                if (leftMostEnemy.x <= 0) {
                    this.currentDirection = MovingDirection.downRight;
                    break;
                }
            } else if (this.currentDirection === MovingDirection.downRight) {
                if (this.moveDown(MovingDirection.right)) {
                    break;
                }
            }

        }
    }

    collideWith = (sprite) => {
        return this.enemyRows.flat().some(enemy => enemy.collideWith(sprite));
    }


    createEnemies = () => {
        this.enemyMap.forEach(((row, rowIndex) => {
            this.enemyRows[rowIndex] = []
            row.forEach((enemyNumber, enemyIndex) => {
                if (enemyNumber > 0) {
                    this.enemyRows[rowIndex].push(new Enemy(enemyIndex * 70, rowIndex * 80, enemyNumber))
                }

            })
        }))
    }


}