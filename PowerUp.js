class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 24;
    this.type = type; // "shield", "rapid", "freeze"
  }

  update() {
    this.y += 2;
  }

  display() {
    if (this.type === "shield") {
      fill(0, 200, 255);
    } else if (this.type === "rapid") {
      fill(255, 100, 100);
    } else if (this.type === "freeze") {
      fill(150, 255, 255);
    }
    ellipse(this.x, this.y, this.size);
  }

  isCollected(player) {
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    const distance = sqrt(dx * dx + dy * dy);
    const combinedRadius = this.size / 2 + player.size / 2 + 10; // ← enlarged pickup range
    return distance < combinedRadius;
  }

  applyEffect(player) {
    if (this.type === "shield") {
      player.shieldActive = true;
      player.shieldTimer = 300;
    } else if (this.type === "rapid") {
      player.rapidFire = true;
      player.rapidTimer = 300;
    } else if (this.type === "freeze") {
      freezeEnemies = true;
      freezeTimer = 180;
    }
  }
}