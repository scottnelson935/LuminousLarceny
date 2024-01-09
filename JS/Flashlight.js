class Flashlight {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.angle = 0; // Initial rotation angle
      this.width = 20; // Flashlight width (used in drawing)
      this.height = 50; // Flashlight height (used in drawlight   this.lightToggle = false; // State of the light
      this.elX = 0;
      this.elY = 180;
      this.elW = 80;
      this.elH = 40;
  
      this.batteryCharge = 100;
      this.batteryDrainRate = 0.2;
      this.batteryRechargeRate = 0.5;
      this.fullCharge = 100;
      
      // Battery display properties
      this.batteryDisplayX = 10; // Starting position X
      this.batteryDisplayY = 10; // Starting position Y
      this.batteryDisplayHeight = 10; // Height of the rectangle
      this.fullBatteryDisplayWidth = 70;
  
      this.sprite = new Sprite(this.x, this.y, this.width, this.height);
      this.sprite.layer = thief.layer - 1;
      flashlightGroup.add(this.sprite);
      this.sprite.overlaps(smokeGroup);
      this.sprite.overlaps(thief);
      this.sprite.flashlightRef = this;
  
      this.sprite2 = new Sprite();
      this.sprite2.visible = false;
      this.sprite2.x = this.elX;
      this.sprite2.y = this.elY;
      this.sprite2.d = this.elW - 25;
      // this.sprite2.w = this.elW;
      // this.sprite2.h = this.elH;
      beamGroup.add(this.sprite2);
      this.sprite2.overlaps(smokeGroup);
      this.sprite2.overlaps(thief);
    }
  
    // Determine the rotation angle based on the flashlight's position
    updateAngle() {
      this.angle = map(this.x, 0, width, -6, 6);
      this.sprite.rotation = this.angle;
      this.sprite2.rotation = this.angle;
      // console.log(this.angle);
    }
  
    toggleLight() {
      // If the light is already on, turn it off
      if (this.lightToggle) {
          this.lightToggle = false;
          this.sprite2.visible = false;  // Hide the beam sprite
      } 
      // Otherwise, if the light is off and the battery is fully charged, turn it on
      else if (this.batteryCharge === this.fullCharge) {
          this.lightToggle = true;
          this.sprite2.visible = false;   // Show the beam sprite
      }
    }
  
    updateBattery() {
      if (this.lightToggle) {
        this.batteryCharge -= this.batteryDrainRate;
        if (this.batteryCharge <= 0) {
          this.lightToggle = false; // turn off the flashlight if the battery is drained
          this.batteryCharge = 0;
        }
      } else {
        this.batteryCharge += this.batteryRechargeRate;
        if (this.batteryCharge > this.fullCharge) {
          this.batteryCharge = this.fullCharge;
        }
      }
    }
  
    display() {
      this.sprite.debug = true;
      this.sprite.draw = () => {
        push();
  
        translate(0, 0);
        rotate(radians(this.sprite.rotation));
        rotate(radians(this.sprite2.rotation));
  
        if (this.lightToggle) {
          // Beam of light
          push();
          noStroke();
          fill(lightColor);
          beginShape();
          vertex(-10, 0);
          vertex(10, 0);
          vertex(40, 180);
          vertex(-40, 180);
          endShape(CLOSE);
  
          arc(0, 180, 80, 40, 0, 180, PIE);
          pop();
  
          push();
          noStroke();
          fill(lightColor);
          ellipse(this.elX, this.elY, this.elW, this.elH);
          pop();
          // this.sprite2.x = this.elX;
          // this.sprite2.y = this.elY;
          // this.sprite2.w = this.elW;
          // this.sprite2.h = this.elH;
          // this.sprite2.debug = true;
        }
  
        // Flashlight handle
        fill(180, 40, 40);
        beginShape();
        vertex(-this.width / 2 + 4, 0);
        vertex(this.width / 2 - 4, 0);
        vertex(this.width / 2 - 4, -this.height);
        vertex(-this.width / 2 + 4, -this.height);
        endShape(CLOSE);
  
        // Flashlight bulb housing
        fill(180, 40, 40);
        beginShape();
        vertex(-this.width / 2, 0);
        vertex(this.width / 2, 0);
        vertex(this.width / 2 + 2, 8);
        vertex(-this.width / 2 - 2, 8);
        endShape(CLOSE);
  
        pop();
      };
      this.sprite2.position.x = this.x - 3 * this.angle;
      this.sprite2.position.y = this.y + 180;
      this.sprite.position.x = this.x;
      this.sprite.position.y = this.y;
  
      this.drawBattery();
    }
    
    drawBattery() {
      // Calculate current width based on charge level
      push();
      noStroke();
      let currentBatteryWidth = map(this.batteryCharge, 0, this.fullCharge, 0, this.fullBatteryDisplayWidth);
  
      // Draw the background (to represent the empty part)
      // fill(220, 20, 20, 100); // Slightly transparent red for empty battery
      // rect(this.batteryDisplayX, this.batteryDisplayY, this.fullBatteryDisplayWidth, this.batteryDisplayHeight);
  
      let chargeColor = map(this.batteryCharge, 0, 100, 0, 255);
      // Draw the current charge level
      fill(255, chargeColor, 180, 150); // Green for available battery
      rect(this.batteryDisplayX, this.batteryDisplayY, currentBatteryWidth, this.batteryDisplayHeight);
      pop();
      fill(darkerOverTime);
      textAlign(CENTER);
      textSize(10);
      text("BATTERY", this.fullBatteryDisplayWidth-25, 33);
    }
  }
  