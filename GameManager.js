class GameManager {
    constructor() {
      this.score = 0;
      this.spawnTimer = 0;
    }
  
    update() {
      this.spawnTimer++;
      if (this.spawnTimer % 60 === 0) {
        let type = random([Enemy, FastEnemy, ZigzagEnemy]);
        enemies.push(new type(random(width), 0));
      }
    }
  }
