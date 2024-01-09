class Window {
    constructor(graphics, x, y, w, h, col, index) {
      this.graphics = graphics;
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.col = col;
      this.prevLightStatus = false;
      this.index = index;
    }
  
    setLightStatus(isOn) {
      this.col = isOn ? "yellow" : "rgb(88,84,117)";
    }
  
    display() {
      this.graphics.push();
      this.graphics.stroke(60, 32, 12);
      this.graphics.fill(this.col);
      this.graphics.rect(this.x, this.y, this.width, this.height);
      this.graphics.pop();
  
      this.graphics.push();
      this.graphics.stroke(0);
      this.graphics.strokeWeight(2);
      this.graphics.line(
        this.x,
        this.y - this.height / 2 + 2,
        this.x,
        this.y + this.height / 2 - 2
      );
      this.graphics.line(
        this.x - this.width / 2 + 2,
        this.y,
        this.x + this.width / 2 - 2,
        this.y
      );
      this.graphics.pop();
    }
  }
  
  function windowsInit() {
    // All initialized as dark
    windows.push(
      new Window(
        farmGraphics,
        width / 2 - 30,
        height / 2 + 75,
        15,
        22,
        "rgb(88,84,117)"
      )
    );
    windows.push(
      new Window(
        farmGraphics,
        width / 2 + 30,
        height / 2 + 75,
        15,
        22,
        "rgb(88,84,117)"
      )
    );
    windows.push(
      new Window(
        farmGraphics,
        width / 2 - 30,
        height / 2 + 25,
        15,
        22,
        "rgb(88,84,117)"
      )
    );
    windows.push(
      new Window(
        farmGraphics,
        width / 2 + 30,
        height / 2 + 25,
        15,
        22,
        "rgb(88,84,117)"
      )
    );
    windows.push(
      new Window(
        farmGraphics,
        width / 2,
        height / 2 + 25,
        15,
        22,
        "rgb(88,84,117)"
      )
    );
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function handleWindowUpdate() {
    disturbanceMeter += 125;
    let windowsToLight = Math.floor(disturbanceMeter / disturbancePerWindow);
    if (!endGame) {
      for (let i = 0; i < windowsToLight; i++) {
        if (windows[i].col === "rgb(88,84,117)") {
          windows[i].col = "yellow";
          // Play the light switch sound here
          lightOnSound.play();
          windowQueue.push(i); // Add the window index to the end of the queue
          break;
        }
      }
    }
  }
  