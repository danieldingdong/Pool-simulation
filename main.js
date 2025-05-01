import { Ball } from "./ball.js";
import { PoolTable } from "./pooltable.js";

const canvas = document.getElementById("poolCanvas");
const table = new PoolTable(canvas);

function animate() {
    requestAnimationFrame(animate);
    table.update();
}

animate();

document.getElementById("resetButton").addEventListener("click", () => {
    table.balls = [];         // Fjern alle kugler
    table.score = 0;          // Nulstil score
    document.getElementById("score").innerText = "Score: 0";
    table.setup();            // Genopbyg bordet
});