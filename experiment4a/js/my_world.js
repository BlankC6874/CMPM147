"use strict";
/* global XXH */
/* exported
    p3_preload,
    p3_setup,
    p3_worldKeyChanged,
    p3_tileWidth,
    p3_tileHeight,
    p3_tileClicked,
    p3_drawBefore,
    p3_drawTile,
    p3_drawSelectedTile,
    p3_drawAfter
*/

// 世界种子
let worldSeed  = 0;
// 点击时间记录
let clickTimes = {};

// 四色映射：只在每个 4×4 大格子中心的 2×2 出现
// (1,1)->绿, (2,1)->红, (1,2)->黄, (2,2)->蓝
const baseColors = {
  "1,1": [ 52, 168,  83],   // 绿
  "2,1": [234,  67,  53],   // 红
  "1,2": [251, 188,   5],   // 黄
  "2,2": [ 66, 133, 244]    // 蓝
};

// 漂浮偏移强度
const floatRange          = 5;
// 发光时间配置
const glowPeriod          = 100; // 相邻两阶段开始间隔 0.1s
const glowDuration        = 150;  // 发光持续 150ms
const idleBetweenCycles   = 1000; // 一整轮（3阶段）后空白 1s
const glowPhases          = 3;    // 3 个阶段
const cycleLength         = glowPeriod * glowPhases + idleBetweenCycles;

function p3_preload() {}
function p3_setup() {}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth()  { return 32; }
function p3_tileHeight() { return 16; }

function p3_tileClicked(i, j) {
  clickTimes[`${i},${j}`] = millis();
}

function p3_drawBefore() {
  background(255);  // 白底
}

function p3_drawTile(i, j) {
  push();

  // —— 单格漂浮偏移 —— 
  let mxNorm = (mouseX / width)  * 2 - 1;
  let myNorm = (mouseY / height) * 2 - 1;
  let t       = millis() / 1000;
  let phaseX  = t + (i + j) * 0.3;
  let phaseY  = t + (i - j) * 0.3;
  let dx      = floatRange * mxNorm * sin(phaseX);
  let dy      = floatRange * myNorm * cos(phaseY);
  translate(dx, dy);

  noStroke();
  let tw = p3_tileWidth(),
      th = p3_tileHeight();

  // 4×4 网格内部坐标
  let mx4 = ((i % 4) + 4) % 4,
      my4 = ((j % 4) + 4) % 4;
  let key = `${mx4},${my4}`;

  // 基础填色：四色或黑白棋盘
  if (baseColors[key]) {
    let c = baseColors[key];
    fill(c[0], c[1], c[2]);
  } else {
    fill((i + j) % 2 === 0 ? 255 : 0);
  }

  // 绘制等距菱形
  beginShape();
    vertex(-tw,  0);
    vertex(  0,  th);
    vertex( tw,  0);
    vertex(  0, -th);
  endShape(CLOSE);

  // —— 发光效果 —— 
  if (baseColors[key]) {
    let now      = millis() % cycleLength;
    // 处于前 glowPeriod*3 内才是阶段，否则空白等待
    if (now < glowPeriod * glowPhases) {
      let phaseTime = now % glowPeriod;
      let phase     = Math.floor(now / glowPeriod);
      let glowing   = (phaseTime < glowDuration);

      // 判断本格子是否在当前阶段发光
      let shine = false;
      if (phase === 0 && key === "2,1") {
        // 阶段 0：红 发光
        shine = glowing;
      } else if (phase === 1 && (key === "1,1" || key === "2,2")) {
        // 阶段 1：绿 + 蓝 同时发光
        shine = glowing;
      } else if (phase === 2 && key === "1,2") {
        // 阶段 2：黄 发光
        shine = glowing;
      }

      if (shine) {
        noFill();
        let c = baseColors[key];
        stroke(c[0], c[1], c[2], 200);
        strokeWeight(4);
        beginShape();
          vertex(-tw * 1.1,  0);
          vertex(  0,  th * 1.1);
          vertex( tw * 1.1,  0);
          vertex(  0, -th * 1.1);
        endShape(CLOSE);
      }
    }
  }

  // —— 点击闪光 —— 
  if (baseColors[key]) {
    let t0 = clickTimes[`${i},${j}`];
    if (t0 !== undefined) {
      let dt = millis() - t0;
      if (dt <= 500) {
        let p     = dt / 500,
            Rmax  = tw * 2,
            R     = p * Rmax,
            alpha = 255 * (1 - p);
        fill(255, 255, 255, alpha);
        ellipse(0, 0, R * 2, R * 2);
      } else {
        delete clickTimes[`${i},${j}`];
      }
    }
  }

  pop();
}

function p3_drawSelectedTile(i, j) {}
function p3_drawAfter() {}
