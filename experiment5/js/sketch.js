/* exported preload, setup, draw */
/* global memory, dropper, restart, rate, slider, activeScore, bestScore, fpsCounter */
/* global getInspirations, initDesign, renderDesign, mutateDesign */

let bestDesign;
let currentDesign;
let currentScore;
let currentInspiration;
let currentCanvas;
let currentInspirationPixels;
let generationCount = 0;

function preload() {
  let allInspirations = getInspirations();

  for (let i = 0; i < allInspirations.length; i++) {
    let insp = allInspirations[i];
    insp.image = loadImage(insp.assetUrl);
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = insp.name;
    dropper.appendChild(option);
  }
  dropper.onchange = e => inspirationChanged(allInspirations[e.target.value]);
  currentInspiration = allInspirations[0];

  restart.onclick = () =>
    inspirationChanged(allInspirations[dropper.value]);
}

function inspirationChanged(nextInspiration) {
  currentInspiration = nextInspiration;
  currentDesign = undefined;
  memory.innerHTML = "";
  setup();
}



function setup() {
  currentCanvas = createCanvas(width, height);
  currentCanvas.parent(document.getElementById("active"));
  currentScore = Number.NEGATIVE_INFINITY;
  currentDesign = initDesign(currentInspiration);
  bestDesign = currentDesign;
  image(currentInspiration.image, 0,0, width, height);
  loadPixels();
  currentInspirationPixels = pixels;
}

function evaluate() {
  loadPixels();

  let error = 0;
  let n = pixels.length;
  
  for (let i = 0; i < n; i++) {
    error += sq(pixels[i] - currentInspirationPixels[i]);
  }
  return 1/(1+error/n);
}



function memorialize() {
  let url = currentCanvas.canvas.toDataURL();

  let img = document.createElement("img");
  img.classList.add("memory");
  img.src = url;
  img.width = width;
  img.heigh = height;
  img.title = currentScore;

  document.getElementById("best").innerHTML = "";
  document.getElementById("best").appendChild(img.cloneNode());

  img.width = width / 2;
  img.height = height / 2;

  memory.insertBefore(img, memory.firstChild);

  if (memory.childNodes.length > memory.dataset.maxItems) {
    memory.removeChild(memory.lastChild);
  }
}

let mutationCount = 0;

// 工具：只克隆我们需要的字段
function cloneDesign(src) {
  return {
    bg:      src.bg,
    // 分别深拷一遍大/小方块数组
    fgLarge: src.fgLarge.map(b => ({ x: b.x, y: b.y, w: b.w, h: b.h })),
    fgSmall: src.fgSmall.map(b => ({ x: b.x, y: b.y, w: b.w, h: b.h })),
    // 下面这些都是只读属性，可以直接复用引用
    ratioX:  src.ratioX,
    ratioY:  src.ratioY,
    orient:  src.orient,
    ow:      src.ow,
    oh:      src.oh,
    // 离屏缓冲要保留，否则 renderDesign 拿不到 pg
    pg:      src.pg,
    dirty:   src.dirty
  };
}

function draw() {
  if (!bestDesign) return;
  // **1. 先用同一个随机计数保证可复现**
  randomSeed(mutationCount++);
  
  // **2. 深拷出一个「干净」currentDesign**，不包含循环引用
  currentDesign = cloneDesign(bestDesign);

  // **3. 进化它**
  mutateDesign(currentDesign, currentInspiration, slider.value/100.0);

  // **4. 用干净版本渲染/评估**
  randomSeed(0);
  renderDesign(currentDesign, currentInspiration);
  let nextScore = evaluate();
  
  activeScore.innerHTML = nextScore;

  // **5. 如果更好，就接管 bestDesign**
  if (nextScore > currentScore) {
    currentScore = nextScore;
    bestDesign    = currentDesign;
    memorialize();
    bestScore.innerHTML = currentScore;
  }

  fpsCounter.innerHTML = Math.round(frameRate());
  generationCount++;
}