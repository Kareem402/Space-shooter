class GameManager {
  constructor(difficulty) {
    this.spawnTimer = 0;
    this.spawnInterval = 60;
    this.waveLevel = 1;

    switch (difficulty) {
      case "easy": this.spawnInterval = 60; break;
      case "medium": this.spawnInterval = 40; break;
      case "hard": this.spawnInterval = 25; break;
    }
  }

  update() {
    this.spawnTimer++;
    let newWave = Math.floor(score / 100) + 1;
    if (newWave > this.waveLevel) {
      this.waveLevel = newWave;
      this.spawnInterval = max(10, this.spawnInterval - 5);
    }
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnEnemy();
      this.spawnTimer = 0;
    }
  }

  spawnEnemy() {
    const x = random(width - 30);
    const y = -30;
    let enemyType = 'basic';
    const rand = random();
    if (this.waveLevel >= 3 && rand < 0.3) enemyType = 'zigzag';
    else if (this.waveLevel >= 2 && rand < 0.6) enemyType = 'fast';

    const speed = 2 + this.waveLevel * 0.2;
    enemies.push(new Enemy(x, y, enemyType, speed));

    if (random() < 0.2) {
      const powerTypes = ['shield', 'rapid', 'freeze'];
      const randomType = random(powerTypes);
      powerUps.push(new PowerUp(x + 10, y + 10, randomType));
    }
  }
}