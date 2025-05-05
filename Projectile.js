class Projectile {
  constructor(x, y, type = 'normal') {
    this.x = x;
    this.y = y;
    this.speed = 8;
    this.type = type;
    this.width = this.type === 'laser' ? 2 : 4;
  }

  update() {
    this.y -= this.speed;
  }

  display() {
    if (this.type === 'laser') fill(0, 255, 255);
    else if (this.type === 'spread') fill(255, 150, 0);
    else fill(255);
    rect(this.x, this.y, this.width, 10);
  }
}
