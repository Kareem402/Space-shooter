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
  
    isCollected(player) {
      return (
        this.x > player.x &&
        this.x < player.x + player.width &&
        this.y > player.y &&
        this.y < player.y + player.height
      );
    }
  
    applyEffect(player) {
      if (this.type === "health") {
        player._health = min(player.maxHealth, player._health + 20);
      }
    }
  }  