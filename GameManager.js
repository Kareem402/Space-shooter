class GameManager {
    constructor(difficulty) {
      this.spawnTimer = 0;
      this.powerUpTimer = 0; // NEW: power-up timer
  
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
      // === ENEMY SPAWNING ===
      this.spawnTimer++;
      if (this.spawnTimer % this.spawnRate === 0) {
        const type = random([Enemy, FastEnemy, ZigzagEnemy]);
        enemies.push(new type(random(width - 30), 0));
      }
  
      // === POWER-UP SPAWNING ===
      this.powerUpTimer++;
      if (this.powerUpTimer % 180 === 0) {
        const powerTypes = ["health", "shield", "rapid"];
        const selected = random(powerTypes);
        powerUps.push(new PowerUp(random(width - 30), 0, selected));
      }
    }
  }  