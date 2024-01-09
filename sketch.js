// Game idea: 2-player collaborative game where one player controls the flashlight to reveal treasure so the other player, the thief, can locate it and pick it up. The treasure is invisible and ungrabbable without the beam of light from the flashlight.

// Treasure chests contain a random amount of gold within a certain range.

// Picking up treasure makes noise, and raises the disturbance meter for the inhabitants of the farmhosue. Once enough inhabitants are disturbed, the game is over. The disturbance level of inhabitants decreases as time passes.
// When morning comes and the rooster crows, the inhabitants wake up, ending the game.

let bgGraphics;

let startTopColor;
let startBottomColor;
let endTopColor;
let endBottomColor;

let starsGraphics;

let farmGraphics;

let lightColor;
let lightToggle = false;
let flashlight;

let thief;
let isThief = false;
let thiefImg;

let bgG;
let bgMusic;

let windows = [];
let windowQueue = [];
let treasures;

const MOVE_FACTOR = 2;

let smokeGroup;

let t1;
let intro = true;
let playState = false;
let goldScore = 0;
let darkerOverTime;

let angrySound;
let cashSound;
let lightOnSound;
let lightOffSound;
let flashlightGroup;
let beamGroup;
let music = false;
let smoke = false;
let crow = false;

let disturbanceMeter = 0;
const MAX_DISTURBANCE = 500;
const disturbancePerWindow = MAX_DISTURBANCE / 5;

let windowTimeout = null;

//timer
let batteryCharge = 100; // current battery percentage, starts at 100%
const batteryDrainRate = 0.5; // how much battery drains each frame when the flashlight is on
const batteryRechargeRate = 0.2; // how much battery charges each frame when the flashlight is off
const fullCharge = 100;

let timeProgress = 0;
const TIME_STEP = 0.0003;

let crowSound;

let endGame = false;
let treasureSize;


function preload() {
  angrySound = loadSound("sounds/angryCrowd.ogg");
  bgMusic = loadSound("sounds/mischiefPizz.mp3");
  bgMusic.setVolume(0.5);
  cashSound = loadSound("sounds/cashRegister.wav");
  cashSound.setVolume(0.2);
  lightOnSound = loadSound("sounds/lightOn.ogg");
  lightOnSound.setVolume(0.5);
  lightOffSound = loadSound("sounds/lightOff.ogg");
  lightOffSound.setVolume(0.5);
  crowSound = loadSound("sounds/crow.wav");
  crowSound.setVolume(0.7);
  thiefImg = loadImage("images/thief3.png");
  treasureImg = loadImage("images/t2.png");

  treasureSize = random(0.3, 0.5);
}

function setup() {
  let cnv = new Canvas(400, 400);

  if (cnv.canvas) {
    let canvasContainer = document.getElementById('canvas-wrapper');
    if (canvasContainer) {
      canvasContainer.appendChild(cnv.canvas);
    }
  }

  noCursor();
  angleMode(DEGREES);
  

  startTopColor = color(15, 20, 45);
  startBottomColor = color(25, 30, 55);
  endTopColor = color(135, 185, 235); // Example dawn colors, adjust as needed
  endBottomColor = color(235, 240, 255);

  starsGraphics = createGraphics(width, height);
  stars();
  bgGraphics = createGraphics(width, height);
  bg();

  farmGraphics = createGraphics(width, height);

  flashlightGroup = new Group();
  beamGroup = new Group();

  windowsInit();

  shuffleArray(windows);

  fg();

  lightColor = color(255, 255, 180, 100);

  //smoke
  smokeGroup = new Group();
}

function makeSprites() {
  //thief sprite
  thief = new Sprite(100, height - 30, 32, 32);
  thief.spriteSheet = thiefImg;
  thief.anis.offset.x = 2;
  thief.anis.frameDelay = 8;
  thief.layer = 0;

  thief.addAnis({
    idle: { row: 0, frames: 10 },
    run: { row: 2, frames: 10 },
  });
  thief.changeAni("idle");

  treasures = new Group();

  t1 = new Treasure(width / 2, height - 50, treasureSize, treasureImg);

  flashlight = new Flashlight(mouseX, mouseY);
}

function startMusic() {
  bgMusic.loop();
  bgMusic.play();
}

function playCrow() {
  crowSound.play();
}

function smokeInterval() {
  setInterval(generateSmoke, 800);
}

function draw() {
  if (intro) {
    bg();
    image(bgGraphics, 0, 0);
    // image(starsGraphics, 0, 0);
    image(farmGraphics, 0, 0);
    push();
    fill('lightgrey');
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(30);
    text('Press Space to start', width/2, height/4);
    pop();
    push();
    fill('lightgrey');
    textAlign(RIGHT);
    textStyle(NORMAL);
    textSize(14);
    text('by Scott Nelson', width - 15, height - 20);
    pop();
    if (kb.presses(' ')) {
      intro = false;
      playState = true;
    }
  }

  if (playState) {
    bg();
    image(bgGraphics, 0, 0);
    image(starsGraphics, 0, 0);
    image(farmGraphics, 0, 0);

    if (!music) {
      startMusic();
      music = true;
    }

    if (!isThief) {
      makeSprites();
      isThief = true;
    }

    if (!smoke) {
      smokeInterval();
      smoke = true;
    }

    darkerOverTime = map(timeProgress, 0, 1, 175, 0);

    timeProgress += TIME_STEP;
    timeProgress = constrain(timeProgress, 0, 1); // Ensure it remains between 0 and 1

    disturbanceMeter -= 0.3; // example value
    disturbanceMeter = constrain(disturbanceMeter, 0, MAX_DISTURBANCE);

    if (!endGame) {
      let currentlyLitWindows = Math.floor(
        disturbanceMeter / disturbancePerWindow
      );

      // Turn OFF lights if needed
      while (windowQueue.length > currentlyLitWindows) {
        let oldestWindowIndex = windowQueue.shift(); // Get the oldest window index
        windows[oldestWindowIndex].setLightStatus(false);
        lightOffSound.play();
      }
      
    }

    //disturbanceMeter
    drawDisturbance();

    let dx = 0;
    let dy = 0;

    if ((kb.pressing("left") || kb.pressing("a")) && thief.x > 8) {
      dx = -MOVE_FACTOR;
    }

    if ((kb.pressing("right") || kb.pressing("d")) && thief.x < width - 8) {
      dx = MOVE_FACTOR;
    }

    if (kb.pressing("up") || kb.pressing("w")) {
      dy = -MOVE_FACTOR;
    }

    if ((kb.pressing("down") || kb.pressing("s")) && thief.y < height - 16) {
      dy = MOVE_FACTOR;
    }

    let desiredY = thief.y + dy;
    let newYLimit = heightLimitAtX(thief.x + dx);

    if (desiredY < newYLimit) {
      dy = newYLimit - thief.y;
      dx = (dy / MOVE_FACTOR) * dx; // Adjust dx based on the change in y to balance the diagonal movement
    }

    thief.x += dx;
    thief.y += dy;

    // Adjust thief's animation and mirror settings based on movement direction
    if (dx != 0 || dy != 0) {
      thief.changeAni("run");

      if (dx < 0) {
        thief.direction = 180;
        thief.mirror.x = true;
      } else if (dx > 0) {
        thief.direction = 0;
        thief.mirror.x = false;
      } else if (dy < 0) {
        thief.direction = -90;
      } else if (dy > 0) {
        thief.direction = 90;
      }
    } else {
      thief.speed = 0;
      thief.changeAni("idle");
    }

    for (let sprite of treasures) {
      let treasureInstance = sprite.treasureRef; // Get the instance of the Treasure class from the sprite
      let flashlightStatus = flashlightGroup[0].flashlightRef.lightToggle;

      // Visibility check
      if (sprite.overlapping(beamGroup) && flashlightStatus) {
        sprite.visible = true;
      } else {
        sprite.visible = false;
      }

      // Thief overlap check
      if (thief.overlaps(treasures) && sprite.visible) {
        treasureInstance.remove(); // Remove old treasure

        // Create new treasure
        let t2 = new Treasure(
          random(width),
          random(325, height),
          treasureSize,
          treasureImg
        );
        treasures.add(t2.sprite); // Add new treasure sprite to the group
        goldScore += floor(map(treasureSize, 0.3, 0.5, 50, 150));
        cashSound.rate(map(treasureSize, 0.3, 0.5, 1.1, 0.9));
        cashSound.play();

        // Schedule the window update after a delay
        if (windowTimeout) {
          clearTimeout(windowTimeout); // Clear any existing timeout
        }
        windowTimeout = setTimeout(handleWindowUpdate, 300); // 300ms delay
      }

      // Check if the treasure hasn't been found for more than a certain time
      else {
        let timeSinceCreation = millis() - treasureInstance.creationTimestamp;
        const THRESHOLD_TIME = 5000; // 5 seconds

        if (timeSinceCreation > THRESHOLD_TIME && !sprite.visible) {
          print("treasure moved!");
          treasureInstance.x = random(width);
          treasureInstance.y = random(325, height);
          treasureInstance.creationTimestamp = millis();
        }
      }
      treasureInstance.display(); // Update the display based on the Treasure class
    }

    for (let i = 0; i < smokeGroup.length; i++) {
      let smoke = smokeGroup[i];

      smoke.position.y -= 2; // Move smoke up
      smoke.scale += 0.01; // Make the smoke grow over time

      // Adjust the sprite's color's alpha value
      let currentAlpha = alpha(smoke.shapeColor);
      smoke.shapeColor = color(150, 150, 150, currentAlpha - 2);

      // If smoke is off the canvas or too faded, remove it
      if (smoke.position.y < 0 || currentAlpha <= 0) {
        smoke.remove();
      }
    }

    thief.overlaps(smokeGroup);
    smokeGroup.layer = thief.layer - 2;
    // drawSprites();
    push();
    noStroke();
    fill(darkerOverTime);
    textAlign(RIGHT);
    textSize(16);
    text("Gold: " + goldScore, width - 12, 20);
    pop();

    for (let w of windows) {
      w.display();
    }

    if (kb.presses("h")) {
      if (windowTimeout) {
        clearTimeout(windowTimeout); // Clear any existing timeout
      }
      windowTimeout = setTimeout(handleWindowUpdate, 600);
    }

    flashlight.x = mouseX;
    flashlight.y = mouseY;
    flashlight.updateBattery();
    flashlight.updateAngle();
    flashlight.display();

    if (disturbanceMeter === MAX_DISTURBANCE) {
      for (let win of windows) {
        win.col = "yellow";
        win.setLightStatus(true);
        win.display();
      }
      bgMusic.setVolume(0, 2, 0);
      angrySound.play();
      if (bgMusic.isPlaying()) {
        bgMusic.setLoop(false);
      }
      endGame = true;
    }

    if (timeProgress >= 1) {
      for (let win of windows) {
        win.col = "yellow";
        win.setLightStatus(true);
        win.display();
      }

      if (bgMusic.isPlaying()) {
        bgMusic.setLoop(false);
      }

      if (!crow) {
        playCrow();
        crow = true;
      }
      endGame = true;
    }
  }

  if (endGame) {

    allSprites.remove();
    // background(0);
    if (bgMusic.isPlaying()) {
      bgMusic.setLoop(false);
    }
    push();
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(24);
    if (timeProgress > 0.5) {
      fill(20, 20, 80);
    }
    text("ALL ARE AWAKENED!", width / 2, height / 2 - 100);
    pop();
    push();
    if (timeProgress > 0.5) {
      fill(20, 20, 80);
    }
    textAlign(CENTER);
    textSize(16);
    text("Gold Collected: " + goldScore, width / 2, height / 2 - 75);
    pop();

    if (windowTimeout) {
      clearTimeout(windowTimeout);
    }
    redraw();
    // noLoop();
  }
}

function mousePressed() {
  flashlight.toggleLight();
}

function heightLimitAtX(x) {
  let h = width / 2;
  let k = height + 98;
  let r = width;

  let yDistFromCenter = sqrt(r * r - (x - h) * (x - h));

  let yOffset = thief.height / 2 - 200; // Assuming the sprite's height property gives its height

  return k - yDistFromCenter - yOffset;
}

function generateSmoke() {
  let smoke = new Sprite(width / 2 - 23, height / 2 - 60); // Position where the chimney top is located
  smoke.img = getSmokeImage();
  smoke.shapeColor = color(150, 150, 150, 255);
  smoke.scale = 0.5;
  smokeGroup.add(smoke);
}

// This function creates a basic smoke image. You can replace this with a more complex drawing or a PNG image of a smoke puff.
function getSmokeImage() {
  let img = createImage(50, 50);
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let distanceFromCenter = dist(x, y, img.width / 2, img.height / 2);
      if (distanceFromCenter <= img.width / 2) {
        let alphaValue = map(distanceFromCenter, 0, img.width / 2, 255, 0);
        img.set(x, y, color(150, 150, 150, alphaValue));
      } else {
        img.set(x, y, color(150, 150, 150, 0));
      }
    }
  }
  img.updatePixels();
  return img;
}

function drawDisturbance() {
  let boxFill = map(disturbanceMeter, 0, 500, 0, 70);
  push();
  noStroke();
  rect(10, 40, boxFill, 10);
  pop();
  push();
  fill(darkerOverTime);
  textAlign(CENTER);
  textSize(8);
  text("DISTURBANCE", 46, 66);
  pop();
}
