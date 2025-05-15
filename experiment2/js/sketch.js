// sketch.js - purpose and description here
// Author: Guangyang Chen
// Date: 2025-04-13

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

// Additional globals for the generative mountain art
let seed = 0;
let peakPoints = [];

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // This is a placeholder method. Extend as needed.
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // Place our canvas and make it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  
  // Create an instance of the class
  myInstance = new MyClass(VALUE1, VALUE2);
  
  // Resize canvas when the page is resized
  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
  
  // Attach event listener to the 'reimagine' button in HTML
  // Make sure you have a button with id "reimagine-btn" in your HTML
  if ($("#reimagine").length > 0) {
    $("#reimagine").click(() => { seed++; });
  }
}

// draw() function is called repeatedly, it's the main animation loop
/* exported setup, draw */
function draw() {
  randomSeed(seed);
  background(135, 206, 235); // Sky blue

  drawClouds();
  drawMountains();
  drawGround();
  drawFlowers();
}

function drawClouds() {
  noStroke();
  const numClouds = 7;
  const baseY = height * 0.25;
  const centerX = width / 2;

  for (let i = 0; i < numClouds; i++) {
    let t = map(i, 0, numClouds - 1, -1, 1); // 从 -1（最左）到 1（最右）
    
    // 水平位置：云朵从左至右分布
    let cx = map(i, 0, numClouds - 1, 50, width - 50);
    let cy = baseY + random(-10, 10); // 少许上下抖动

    // 角度：以扇形为基础，每条云 ±10° 的扰动
    let baseAngle = radians(t * 45); // -45° 到 +45°
    let angle = baseAngle + radians(random(-10, 10));

    // 随机宽度（厚度）和长度
    let w = random(12, 30);   // 宽（视觉厚度）
    let h = random(220, 300); // 长（纵向延展）

    push();
    translate(cx, cy);
    rotate(angle);
    fill(255, 255, 255, 180);
    rect(-w / 2, -h / 2, w, h, 10);
    pop();
  }
}

function drawMountains() {
  noStroke();
  const baseY = height * 0.6;
  const snowlineY = height * 0.48; // 调高雪线：越小越难触发白色
  const numShapes = 35;

  for (let i = 0; i < numShapes; i++) {
    let shapeType = random() < 0.7 ? 'triangle' : 'trapezoid';
    let baseX = random(-50, width + 50);
    let baseWidth = random(40, 90);

    let peakHeight = shapeType === 'triangle'
      ? random(80, 150)
      : random(40, 80);
    let peakY = baseY - peakHeight;

    if (shapeType === 'triangle') {
      let isSnowCapped = (peakY <= snowlineY) && (peakHeight >= 120);
      fill(isSnowCapped ? 255 : color(0, 100, 0));
      let peakX = baseX + baseWidth / 2;
      triangle(baseX, baseY, baseX + baseWidth, baseY, peakX, peakY);
    } else {
      fill(0, 100, 0);
      let topWidth = baseWidth * random(0.4, 0.8);
      let leftTop = baseX + (baseWidth - topWidth) / 2;
      let rightTop = leftTop + topWidth;

      beginShape();
      vertex(baseX, baseY);
      vertex(baseX + baseWidth, baseY);
      vertex(rightTop, peakY);
      vertex(leftTop, peakY);
      endShape(CLOSE);
    }
  }
}

function drawGround() {
  noStroke();
  fill(85, 160, 85); // Balanced green for grass
  rect(0, height * 0.6, width, height * 0.4);
}

function drawFlowers() {
  let numFlowers = 60;
  let xOffset = map(mouseX, 0, width, -30, 30);
  for (let i = 0; i < numFlowers; i++) {
    let x = random(-50, width + 50) + xOffset;
    let y = random(height * 0.75, height * 0.95);
    let stemHeight = random(20, 35);
    let flowerSize = random(6, 12);

    // Stem
    stroke(34, 139, 34);
    strokeWeight(2);
    line(x, y, x, y - stemHeight);

    // Leaves
    noFill();
    strokeWeight(1.5);
    let leafY = y - random(5, 10);
    line(x, leafY, x - 5, leafY - 5);
    line(x, leafY, x + 5, leafY - 5);

    // Flower head
    noStroke();
    fill(255, 215, 0);
    ellipse(x, y - stemHeight, flowerSize, flowerSize);
    fill(200, 50, 50);
    ellipse(x, y - stemHeight, flowerSize / 2);
  }
}