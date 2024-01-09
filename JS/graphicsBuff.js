function fg() {
    farmGraphics.angleMode(DEGREES);
    farmGraphics.rectMode(CENTER);
  
    //farmhouse
    farmGraphics.strokeWeight(3);
    farmGraphics.stroke(60, 32, 12);
    farmGraphics.fill(150, 130, 85);
    farmGraphics.rect(width / 2, (height / 4) * 3 - 50, 100);
    //roof
    farmGraphics.fill(110, 60, 20);
    farmGraphics.beginShape();
    farmGraphics.vertex(width / 2 - 60, height / 2);
    farmGraphics.vertex(width / 2 - 45, height / 2 - 30);
    farmGraphics.vertex(width / 2 + 45, height / 2 - 30);
    farmGraphics.vertex(width / 2 + 60, height / 2);
    farmGraphics.endShape(CLOSE);
    //front door
    farmGraphics.fill(70, 40, 20);
    farmGraphics.rect(width / 2, height / 2 + 82, 20, 40);
    farmGraphics.push();
    farmGraphics.fill(175, 160, 50);
    farmGraphics.noStroke();
    farmGraphics.circle(width / 2 + 6, height / 2 + 84, 3);
    farmGraphics.pop();
  
    for (let w of windows) {
      w.display();
    }
  
    farmGraphics.push();
  
    let chimneyWidth = 100 * 0.15; // Adjust this to change the chimney's width
    let chimneyHeight = 100 * 0.2; // Adjust this to change the chimney's height
  
    let chimneyX = width / 2 - chimneyWidth / 2;
    let chimneyY = height / 2 - chimneyHeight;
  
    farmGraphics.fill(100, 35, 35); // A reddish-brown color
    farmGraphics.noStroke();
  
    // Draw the main chimney rectangle
    farmGraphics.rect(
      chimneyX - chimneyWidth,
      chimneyY - chimneyHeight - 1,
      chimneyWidth,
      chimneyHeight
    );
  
    // Optional: Draw a border around the chimney for added detail
    farmGraphics.stroke(60, 35, 10); // A darker reddish-brown color
    farmGraphics.strokeWeight(3);
    farmGraphics.line(
      chimneyX - chimneyWidth - chimneyWidth / 2,
      chimneyY - chimneyHeight - chimneyHeight / 2 - 1,
      chimneyX - chimneyWidth - chimneyWidth / 2,
      chimneyY - chimneyHeight / 2 - 1
    );
    farmGraphics.line(
      chimneyX - chimneyWidth / 2,
      chimneyY - chimneyHeight - chimneyHeight / 2 - 1,
      chimneyX - chimneyWidth / 2,
      chimneyY - chimneyHeight / 2 - 1
    );
    farmGraphics.pop();
  
    //hill
    farmGraphics.fill(30, 80, 40);
    farmGraphics.stroke(20, 60, 27);
    farmGraphics.strokeWeight(4);
    farmGraphics.arc(width / 2, height + 98, width * 2, width, 180, 360, PIE);
  }
  
  function bg() {
    let currentTopColor = lerpColor(startTopColor, endTopColor, timeProgress);
    let currentBottomColor = lerpColor(
      startBottomColor,
      endBottomColor,
      timeProgress
    );
  
    for (let y = 0; y <= height; y++) {
      let inter = map(y, 0, height, 0, 1); // Compute the interpolation factor
      let c = lerpColor(currentTopColor, currentBottomColor, inter);
  
      bgGraphics.stroke(c);
      bgGraphics.line(0, y, width, y);
    }
  }
  
  function stars() {
    let numStars = 100; // Adjust this number for more/less stars
  
    for (let i = 0; i < numStars; i++) {
      let x = random(width);
      let y = random(height * 0.8); // Assuming you want stars only in the top 80% of the screen
  
      let brightness = map(y, 0, height, 255, 50); // Stars are brighter at the top
      let alpha = map(y, 0, height, 255, 0); // Stars fade as they go down
  
      starsGraphics.stroke(brightness, alpha);
      starsGraphics.point(x, y);
    }
  }