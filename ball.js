class Ball{ 
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
            const minDist = this.radius + other.radius;
        
            if (distance < minDist) {
                // 1. Separér kuglerne så de ikke overlapper
                let overlap = 0.5 * (minDist - distance + 0.1); // Lidt ekstra for at sikre separation
                let nx = dx / distance;
                let ny = dy / distance;
        
                this.x -= nx * overlap;
                this.y -= ny * overlap;
                other.x += nx * overlap;
                other.y += ny * overlap;
        
                // 2. Beregn de oprindelige hastigheder og retninger
                let angle = Math.atan2(dy, dx);
                let speed1 = Math.sqrt(this.velocity.x ** 2 + this.velocity.y ** 2);
                let speed2 = Math.sqrt(other.velocity.x ** 2 + other.velocity.y ** 2);
                let direction1 = Math.atan2(this.velocity.y, this.velocity.x);
                let direction2 = Math.atan2(other.velocity.y, other.velocity.x);
        
                // 3. Roter hastigheder til kollisionsakse
                let velocity1 = {
                    x: speed1 * Math.cos(direction1 - angle),
                    y: speed1 * Math.sin(direction1 - angle)
                };
                let velocity2 = {
                    x: speed2 * Math.cos(direction2 - angle),
                    y: speed2 * Math.sin(direction2 - angle)
                };
        
                // 4. Brug elastisk kollision i 1D (langs kollisionslinjen)
                let massSum = this.mass + other.mass;
                let newVelX1 = ((this.mass - other.mass) * velocity1.x + 2 * other.mass * velocity2.x) / massSum;
                let newVelX2 = ((other.mass - this.mass) * velocity2.x + 2 * this.mass * velocity1.x) / massSum;
        
                // 5. Tilføj lidt energitab som friktion (mellem 0.9 og 1)
                const damping = 0.95;
                newVelX1 *= damping;
                newVelX2 *= damping;
                velocity1.y *= damping;
                velocity2.y *= damping;
        
                // 6. Roter tilbage til det oprindelige koordinatsystem
                this.velocity.x = newVelX1 * Math.cos(angle) + velocity1.y * Math.cos(angle + Math.PI / 2);
                this.velocity.y = newVelX1 * Math.sin(angle) + velocity1.y * Math.sin(angle + Math.PI / 2);
                other.velocity.x = newVelX2 * Math.cos(angle) + velocity2.y * Math.cos(angle + Math.PI / 2);
                other.velocity.y = newVelX2 * Math.sin(angle) + velocity2.y * Math.sin(angle + Math.PI / 2);
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

    export {Ball}