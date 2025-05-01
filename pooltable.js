import { Ball } from "./ball.js";
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
            const ballRadius = 10;
            const startX = 500;
            const startY = 200;
            const rowGap = ballRadius * Math.sqrt(3);
        
            // Farver uden sort kugle (14 stk)
            let colors = [
                "red", "blue", "blue", "yellow", "yellow",
                "red", "darkgreen", "darkgreen", "orange", "orange",
                "purple", "purple", "blue", "orange"
            ];
        
            // Bland farverne tilfældigt
            colors = colors.sort(() => Math.random() - 0.5);
        
            let colorIndex = 0;
            for (let row = 0; row < 5; row++) {
                for (let i = 0; i <= row; i++) {
                    const x = startX + row * (ballRadius * 2);
                    const y = startY - (row * rowGap / 2) + i * rowGap;
        
                    // Læg sort kugle i midten (række 3, position 1)
                    if (row === 2 && i === 1) {
                        this.balls.push(new Ball(x, y, ballRadius, "black", 1));
                    } else {
                        this.balls.push(new Ball(x, y, ballRadius, colors[colorIndex], 1));
                        colorIndex++;
                    }
                }
            }
        
            // Tilføj cue ball
            this.balls.push(new Ball(150, 200, ballRadius, "white", 1, true));
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

    export { PoolTable }; // Export the PoolTable