class PowerUp {
    constructor(x, y, type) {
      this.x = x;
      this.y = y;
      this.type = type; // "health", "shield", "rapid"
      this.size = 20;
    }
  
    update() {
      this.y += 2;
    }
  
    display() {
      switch (this.type) {
        case "health":
          fill(0, 255, 0); // green
          break;
        case "shield":
          fill(0, 0, 255); // blue
          break;
        case "rapid":
          fill(255, 0, 0); // red
          break;
        default:
          fill(255, 255, 0); // yellow
      }
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
      } else if (this.type === "shield") {
        player.shieldActive = true;
        player.shieldTimer = 300; // 5 seconds
      } else if (this.type === "rapid") {
        player.rapidFire = true;
        player.rapidTimer = 300; // 5 seconds
      }
    }
  }  