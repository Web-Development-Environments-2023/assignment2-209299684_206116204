export default class Life {
    constructor(canvas, x, y) {
        this.canvas = canvas
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;

        this.image = new Image();
        this.image.src = `resources/images/life.png`;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }



}