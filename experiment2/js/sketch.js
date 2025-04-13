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
function draw() {
  // ----- Generative Mountain Art Composition -----
  
  // Set the random seed so that each "reimagine" click produces a unique scene
  randomSeed(seed);
  
  // Draw sky background (inspired by alpine vistas)
  background(135, 206, 235);
  
  // Draw the sun; its size reacts to the mouseX position to bring in a sense of life
  noStroke();
  let sunSize = map(mouseX, 0, width, 30, 70);
  fill(255, 223, 0);
  ellipse(width - 50, 50, sunSize, sunSize);
  
  // Draw mountains using a custom-shaped polygon
  stroke(0, 100, 0);
  fill(0, 100, 0); // Deep green for the mountain bodies
  beginShape();
  vertex(0, height * 0.6);
  
  // Generate mountain peaks with randomness
  peakPoints = [];
  let numPeaks = 10;
  for (let i = 0; i <= numPeaks; i++) {
    let x = map(i, 0, numPeaks, 0, width);
    let y = height * 0.6 - random(20, 80); // Lower y means higher peaks
    vertex(x, y);
    peakPoints.push({ x: x, y: y });
  }
  
  vertex(width, height * 0.6);
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  
  // Add snowcaps to the higher peaks (snow white)
  noStroke();
  fill(255);
  peakPoints.forEach(pt => {
    // Only add a snowcap if the peak is sufficiently high
    if (pt.y < height * 0.6 - 30) {
      let snowCapHeight = 15;
      let snowCapWidth = 25;
      // Lower the apex of the snowcap so that it blends better with the mountain
      triangle(
        pt.x, pt.y - snowCapHeight * 0.5,
        pt.x - snowCapWidth / 2, pt.y,
        pt.x + snowCapWidth / 2, pt.y
      );
    }
  });
  
  // Draw wildflowers on the meadow using simple ellipses with a subtle sway effect
  let numFlowers = 15;
  for (let i = 0; i < numFlowers; i++) {
    let x = random(0, width);
    let y = random(height * 0.7, height * 0.9);
    let flowerSize = random(5, 15);
    let sway = sin(frameCount / 20 + i) * 5;
    x += sway;
    noStroke();
    fill(255, 215, 0); // Bright yellow for petals
    ellipse(x, y, flowerSize, flowerSize);
    fill(200, 50, 50); // A contrasting color for the flower center
    ellipse(x, y, flowerSize / 2, flowerSize / 2);
  }
  // ----- End of Generative Mountain Art Composition -----
}

// mousePressed() function is called whenever a mouse button is pressed
function mousePressed() {
    // Add any mouse interaction logic here if needed
}