class Ball {
    constructor(x, y, radius, color, mass, isCue = false) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.mass = mass;
        this.velocity = { x: 0, y: 0 };
        this.isCue = isCue;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.applyFriction();
    }

    applyFriction() {
        this.velocity.x *= 0.98;
        this.velocity.y *= 0.98;
    }

    checkWallCollision(canvasWidth, canvasHeight) {
        if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) {
            this.velocity.x *= -1;
            this.x = Math.max(this.radius, Math.min(this.x, canvasWidth - this.radius));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) {
            this.velocity.y *= -1;
            this.y = Math.max(this.radius, Math.min(this.y, canvasHeight - this.radius));
        }
    }

    checkCollision(other) {
        let dx = other.x - this.x;
        let dy = other.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + other.radius) {
            let angle = Math.atan2(dy, dx);
            let speed1 = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
            let speed2 = Math.sqrt(other.velocity.x ** 2 + other.velocity.y ** 2);
            let direction1 = Math.atan2(this.velocity.y, this.velocity.x);
            let direction2 = Math.atan2(other.velocity.y, other.velocity.x);

            let newVelX1 = speed2 * Math.cos(direction2 - angle);
            let newVelY1 = speed2 * Math.sin(direction2 - angle);
            let newVelX2 = speed1 * Math.cos(direction1 - angle);
            let newVelY2 = speed1 * Math.sin(direction1 - angle);

            this.velocity.x = newVelX1 * Math.cos(angle) + newVelY1 * Math.cos(angle + Math.PI / 2);
            this.velocity.y = newVelX1 * Math.sin(angle) + newVelY1 * Math.sin(angle + Math.PI / 2);
            other.velocity.x = newVelX2 * Math.cos(angle) + newVelY2 * Math.cos(angle + Math.PI / 2);
            other.velocity.y = newVelX2 * Math.sin(angle) + newVelY2 * Math.sin(angle + Math.PI / 2);
        }
    }

    checkPocket(pockets) {
        const pocketRadius = 10;
        for (let pocket of pockets) {
            let dx = this.x - pocket.x;
            let dy = this.y - pocket.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.radius + pocketRadius) {  // Check if ball is inside the pocket
                return true;
            }
        }
        return false;
    }
}

class PoolTable {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.balls = [];
        this.pockets = [
            { x: 0, y: 0 }, // top-left
            { x: 800, y: 0 }, // top-right
            { x: 0, y: 400 }, // bottom-left
            { x: 800, y: 400 }, // bottom-right
            { x: 400, y: 0 }, // top-center
            { x: 400, y: 400 }, // bottom-center
        ];
        this.score = 0;
        this.mouse = { x: 0, y: 0, down: false };
        this.setup();
        this.addMouseControls();
    }

    setup() {
        this.balls.push(new Ball(200, 200, 10, "white", 1, true)); // Cue ball
        this.balls.push(new Ball(300, 200, 10, "red", 1)); // Another ball
    }

    addMouseControls() {
        this.canvas.addEventListener("mousedown", (e) => {
            this.mouse.down = true;
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        });

        this.canvas.addEventListener("mouseup", (e) => {
            if (this.mouse.down) {
                let cueBall = this.balls.find(ball => ball.isCue);
                let dx = this.mouse.x - e.offsetX;
                let dy = this.mouse.y - e.offsetY;
                cueBall.velocity.x = dx * -0.1;
                cueBall.velocity.y = dy * -0.1;
            }
            this.mouse.down = false;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw pockets
        this.ctx.fillStyle = "black";
        for (let pocket of this.pockets) {
            this.ctx.beginPath();
            this.ctx.arc(pocket.x, pocket.y, 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
        // Draw balls
        this.balls.forEach(ball => ball.draw(this.ctx));
    }

    update() {
        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            ball.update();
            ball.checkWallCollision(this.canvas.width, this.canvas.height);
            for (let j = i + 1; j < this.balls.length; j++) {
                ball.checkCollision(this.balls[j]);
            }
            // Check if ball falls into a pocket
            if (ball.checkPocket(this.pockets)) {
                this.balls.splice(i, 1); // Remove the ball
                this.score++;
                document.getElementById("score").innerText = `Score: ${this.score}`;
                i--; // Adjust index after removal
            }
        }
        this.draw();
    }
}

const canvas = document.getElementById("poolCanvas");
const table = new PoolTable(canvas);

function animate() {
    requestAnimationFrame(animate);
    table.update();
}

animate();
