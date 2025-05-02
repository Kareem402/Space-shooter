class GameManager {
    constructor(difficulty) {
      this.spawnTimer = 0;
  
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
      this.spawnTimer++;
      if (this.spawnTimer % this.spawnRate === 0) {
        let type = random([Enemy, FastEnemy, ZigzagEnemy]);
        enemies.push(new type(random(width - 30), 0));
      }
    }
  }
  