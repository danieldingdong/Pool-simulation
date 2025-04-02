class Ball {
    constructor(id, color, x, y) {
        this.id = id;
        this.color = color;
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.createElement();
    }

    createElement() {
        const ball = document.createElement("div");
        ball.id = this.id;
        ball.className = "ball";
        ball.style.background = this.color;
        ball.style.left = `${this.x}px`;
        ball.style.top = `${this.y}px`;
        document.getElementById("poolTable").appendChild(ball);
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityX *= 0.98;
        this.velocityY *= 0.98;
        if (Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
        if (Math.abs(this.velocityY) < 0.1) this.velocityY = 0;
        if (this.x <= 0 || this.x >= 780) this.velocityX *= -1;
        if (this.y <= 0 || this.y >= 380) this.velocityY *= -1;
        document.getElementById(this.id).style.left = `${this.x}px`;
        document.getElementById(this.id).style.top = `${this.y}px`;
    }
}

let balls = [
    new Ball("cue-ball", "white", 390, 190),
    new Ball("target-ball", "red", 300, 200)
];

let shooting = false;

document.addEventListener("mousedown", () => { shooting = true; });
document.addEventListener("mouseup", () => {
    if (shooting) {
        balls[0].velocityX = (Math.random() * 4) - 2;
        balls[0].velocityY = (Math.random() * 4) - 2;
        shooting = false;
        animateBalls();
    }
});

function animateBalls() {
    balls.forEach(ball => ball.move());
    if (balls.some(ball => ball.velocityX !== 0 || ball.velocityY !== 0)) {
        requestAnimationFrame(animateBalls);
    }
}

function resetGame() {
    balls.forEach(ball => {
        ball.x = ball.id === "cue-ball" ? 390 : 300;
        ball.y = ball.id === "cue-ball" ? 190 : 200;
        ball.velocityX = 0;
        ball.velocityY = 0;
        document.getElementById(ball.id).style.left = `${ball.x}px`;
        document.getElementById(ball.id).style.top = `${ball.y}px`;
    });
}