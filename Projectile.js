class Projectile {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 8;
  }

  update() {
    this.y -= this.speed;
  }

  display() {
    fill(255);
    rect(this.x, this.y, 4, 10);
  }
}