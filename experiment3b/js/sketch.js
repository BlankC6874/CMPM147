// sketch.js - purpose and description here
// Author: Guangyang Chen
// Date: 2025-04-20

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

/* p2_solution.js for Overworld with selective animation + correct tree tiles */
/* exported generateGrid, drawGrid */
/* global placeTile */

const LAND   = '.';
const WATER  = '~';
const TREE   = 'T';

// 动画帧资源（Micro Tileset – Overworld & Dungeon by thkaspar）
// Grass frames: (1,0),(2,0),(3,0)
// Water frames: (1,13),(2,13),(3,13)
// Index 0 帧作静态纯色块：Grass (0,0)、Water (0,13)
const grassFrames = [[0,0],[1,0],[2,0]];
const waterFrames = [[0,13],[1,13],[2,13]];

// 树木帧区域：ti=20..27, tj=3..7
const treeFrames = [];
for (let tj = 3; tj <= 7; tj++) {
  for (let ti = 20; ti <= 27; ti++) {
    treeFrames.push([ti, tj]);
  }
}

// 简化 autotile lookup（中心/边缘同一偏移）
const LOOKUP = Array.from({length:16}, (_,i) => i === 0 ? [0,0] : [1,0]);

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // 0=static, 1=animated
      let code = noise(i/10, j/10) > 0.5 ? LAND : WATER;
      // 少量随机树木
      if (code === LAND && random() < 0.05) code = TREE;
      row.push(code);
    }
    grid.push(row);
  }
  return grid;
}

function gridCheck(grid, i, j, target) {
  return i>=0 && i<grid.length && j>=0 && j<grid[0].length && grid[i][j]===target;
}
function gridCode(grid, i, j, target) {
  let b0 = gridCheck(grid,i-1,j,target)|0;
  let b1 = gridCheck(grid,i+1,j,target)|0;
  let b2 = gridCheck(grid,i,j+1,target)|0;
  let b3 = gridCheck(grid,i,j-1,target)|0;
  return (b0<<0)|(b1<<1)|(b2<<2)|(b3<<3);
}
function drawContext(i, j, baseTi, baseTj, lookupIdx) {
  const [dx, dy] = LOOKUP[lookupIdx];
  placeTile(i, j, baseTi+dx, baseTj+dy);
}

function drawGrid(grid) {
  background(0);

  // const t = floor(millis() / 500) % 2;  // 0 or 1
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const c = grid[i][j];
      const codeIdx = gridCode(grid, i, j, c);

      if (c === LAND) {
        // 跨格静态/动画交替：静态格子只有纯绿色
        const frame = ((i+j)&1) === 0
          ? grassFrames[0]
          : grassFrames[1 + (floor(millis()/400) % (grassFrames.length-1))];
        drawContext(i, j, frame[0], frame[1], codeIdx);

      } else if (c === WATER) {
        const frame = ((i+j)&1) === 0
          ? waterFrames[0]
          : waterFrames[1 + (floor(millis()/600) % (waterFrames.length-1))];
        drawContext(i, j, frame[0], frame[1], codeIdx);

      } else if (c === TREE) {
        // 先绘草底或水底
        const under = noise(i/10,j/10)>0.5 ? grassFrames[0] : waterFrames[0];
        drawContext(i, j, under[0], under[1], codeIdx);
        // 随机树型
        const [ti, tj] = treeFrames[(i*grid[0].length + j) % treeFrames.length];
        placeTile(i, j, ti, tj);
      }

      // 云影：随机在陆地+树上出现
      if ((c === LAND || c === TREE)
          && noise(i/5 + millis()/5000, j/5 - millis()/5000) < 0.3) {
        noStroke();
        fill(255,255,255,30);
        rect(j*16, i*16, 16,16);
      }
    }
  }
}