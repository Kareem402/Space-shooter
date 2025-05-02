class GameManager {
    constructor(difficulty) {
      this.spawnTimer = 0;
      this.powerUpTimer = 0; // NEW: separate timer for power-ups
  
      switch (difficulty) {
        case "easy":
          this.spawnRate = 90;
          break;
        case "medium":
          this.spawnRate = 60;
          break;
        case "hard":
          this.spawnRate = 30;
          break;
        default:
          this.spawnRate = 60;
      }
    }
  
    update() {
      // === Enemy Spawning ===
      this.spawnTimer++;
      if (this.spawnTimer % this.spawnRate === 0) {
        let type = random([Enemy, FastEnemy, ZigzagEnemy]);
        enemies.push(new type(random(width - 30), 0));
      }
  
      // === Power-Up Spawning ===
      this.powerUpTimer++;
      if (this.powerUpTimer % 180 === 0) { // every 3 seconds
        const powerTypes = ["health"]; // add more later: "shield", "rapid", etc.
        const chosenType = random(powerTypes);
        powerUps.push(new PowerUp(random(width - 30), 0, chosenType));
      }
    }
  }  