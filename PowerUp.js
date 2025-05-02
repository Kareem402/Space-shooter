class PowerUp {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type;
      this.size = 20;
    }
  
    update() {
      this.y += 2;
    }
  
    display() {
      fill(0, 0, 255);
      ellipse(this.x, this.y, this.size);
    }
  }
  