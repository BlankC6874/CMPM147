// sketch.js - purpose and description here
// Author: Guangyang Chen
// Date: 2025-04-20

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

/* p2_solution.js：dungeon grid generator */
/* exported generateGrid, drawGrid */
/* global placeTile */

const FLOOR    = '.';
const CORRIDOR = '+';
const WALL     = '#';

// 先给 16 种邻居组合建两个 lookup 表（relative offsets）
// 简化版本：无邻居->[0,0]，有任意邻居->[1,0]
const ROOM_LOOKUP     = Array.from({length:16}, (_,i) => i===0 ? [0,0] : [1,0]);
const CORRIDOR_LOOKUP = Array.from({length:16}, (_,i) => i===0 ? [0,0] : [1,0]);

// base 坐标：FLOOR 在 (2,3)，CORRIDOR 在 (1,3)
const TILE_BASE = {
  [FLOOR]:    [2, 3],
  [CORRIDOR]: [1, 3]
};

function generateGrid(numCols, numRows) {
  let grid = Array.from({ length: numRows },
    () => Array.from({ length: numCols }, () => WALL));

  // 随机 3–5 个不重叠房间
  const targetRooms = floor(random(3, 6));
  let rooms = [], tries = 0;
  while (rooms.length < targetRooms && tries < targetRooms*10) {
    tries++;
    const w = floor(random(4, 8)), h = floor(random(4, 8));
    const x1 = floor(random(1, numRows-h-1)), y1 = floor(random(1, numCols-w-1));
    const x2 = x1 + h-1, y2 = y1 + w-1;
    // 碰撞检测+1格缓冲
    let ok = true;
    for (let r of rooms) {
      if (x1 <= r.x2+1 && x2 >= r.x1-1 && y1 <= r.y2+1 && y2 >= r.y1-1) {
        ok = false; break;
      }
    }
    if (!ok) continue;
    // 凿房间
    for (let i = x1; i <= x2; i++) {
      for (let j = y1; j <= y2; j++) {
        grid[i][j] = FLOOR;
      }
    }
    rooms.push({ x1,y1,x2,y2, cx:floor((x1+x2)/2), cy:floor((y1+y2)/2) });
  }

  // L 型走廊连接每对相邻房间中心
  for (let i=1; i<rooms.length; i++) {
    const a = rooms[i-1], b = rooms[i];
    for (let y = min(a.cy,b.cy); y <= max(a.cy,b.cy); y++) {
      grid[a.cx][y] = CORRIDOR;
    }
    for (let x = min(a.cx,b.cx); x <= max(a.cx,b.cx); x++) {
      grid[x][b.cy] = CORRIDOR;
    }
  }

  return grid;
}

// Step 4: Autotiling Helpers
function gridCheck(grid, i, j, target) {
  return i>=0 && i<grid.length && j>=0 && j<grid[0].length && grid[i][j]===target;
}
function gridCode(grid, i, j, target) {
  // bit0 = north, bit1 = south, bit2 = east, bit3 = west
  let b0 = gridCheck(grid,i-1,j,target)|0;
  let b1 = gridCheck(grid,i+1,j,target)|0;
  let b2 = gridCheck(grid,i,j+1,target)|0;
  let b3 = gridCheck(grid,i,j-1,target)|0;
  return (b0<<0)|(b1<<1)|(b2<<2)|(b3<<3);
}
function drawContext(grid, i, j, code, baseTi, baseTj, lookup) {
  const idx = gridCode(grid, i, j, code);
  const [dx, dy] = lookup[idx];
  placeTile(i, j, baseTi + dx, baseTj + dy);
}

function drawGrid(grid) {
  // 墙体全黑背景
  background(0);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const c = grid[i][j];
      if (c === WALL) continue; // 不画墙

      // 选对应的 autotile
      const [baseTi, baseTj] = TILE_BASE[c];
      const lookup = c===FLOOR ? ROOM_LOOKUP : CORRIDOR_LOOKUP;
      drawContext(grid, i, j, c, baseTi, baseTj, lookup);

      // 鼠标靠近高亮
      const px = j*16 + 8, py = i*16 + 8;
      const d  = dist(px, py, mouseX, mouseY);
      if (d < 48) {
        noStroke();
        fill(255,255,200, map(d,0,48,180,0));
        ellipse(px, py, 24);
      }
    }
  }
}