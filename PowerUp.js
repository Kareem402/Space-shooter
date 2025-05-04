class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.type = type; // "shield", "rapid", "freeze"
  }

  update() {
    this.y += 2;
  }

  display() {
    if (this.type === "shield") {
      fill(0, 200, 255); // blue
    } else if (this.type === "rapid") {
      fill(255, 100, 100); // red
    } else if (this.type === "freeze") {
      fill(150, 255, 255); // cyan
    }
    ellipse(this.x, this.y, this.size);
  }

  isCollected(player) {
    return dist(this.x, this.y, player.x, player.y) < this.size;
  }

  applyEffect(player) {
    if (this.type === "shield") {
      player.shieldActive = true;
      player.shieldTimer = 300;
    } else if (this.type === "rapid") {
      player.rapidFire = true;
      player.rapidTimer = 300;
    } else if (this.type === "freeze") {
      window.freezeEnemies = true;
      window.freezeTimer = 180;
    }
  }
}