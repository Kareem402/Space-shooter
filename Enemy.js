class Enemy {
  constructor(x, y, type = 'basic', speed = 2) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.baseSpeed = speed;
    this.speed = speed;

    // for zig-zag
    this.angle = 0;
    this.amplitude = 30;
    this.direction = random() < 0.5 ? 1 : -1;

    // size
    this.size = 30;
  }

  update() {
    if (this.type === 'zigzag') {
      this.x += sin(this.angle) * this.direction * 2;
      this.y += this.speed;
      this.angle += 0.1;
    } else {
      this.y += this.speed;
    }
  }

  display() {
    switch (this.type) {
      case 'fast':
        fill(255, 165, 0); // orange
        break;
      case 'zigzag':
        fill(186, 85, 211); // purple
        break;
      default:
        fill(255, 0, 0); // red
    }
    rect(this.x, this.y, this.size, this.size);
  }
}