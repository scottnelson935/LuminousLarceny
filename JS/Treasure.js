class Treasure {
    constructor(x, y, size, img) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.img = img;
      this.creationTimestamp = millis();
  
      this.sprite = new Sprite(this.x, this.y, this.width, this.height);
      this.sprite.visible = false;
      this.sprite.img = this.img;
      this.sprite.scale = this.size;
      this.sprite.layer = thief.layer +2;
      this.sprite.overlaps(thief);
      this.sprite.overlaps(flashlightGroup);
      this.sprite.overlaps(beamGroup);
      treasures.add(this.sprite);
      this.sprite.treasureRef = this;
    }
  
    display() {
      // this.sprite.debug = true;
  
      this.sprite.position.x = this.x;
      this.sprite.position.y = this.y;
    }
  
    remove() {
      this.sprite.removed = true;
    }
  }
  