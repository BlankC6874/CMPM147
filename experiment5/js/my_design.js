// my_design.js - purpose and description here
// Author: Guangyang Chen
// Date: 2025-05-07

/* exported p4_inspirations, p4_initialize, p4_render, p4_mutate */

function getInspirations() {
  return [
    {
      name: "Mondrian",
      assetUrl: "https://cdn.glitch.global/33484210-1b90-48ea-8e5a-247369d2ac68/2048px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg?v=1746642114637",
      credit:  "Piet Mondrian, Public domain, via Wikimedia Commons"
    },
    {
      name: "Sunset",
      assetUrl: "https://cdn.glitch.global/33484210-1b90-48ea-8e5a-247369d2ac68/2048px-Silhouette_Sunset.jpg?v=1746642110547",
      credit:  "Prithivipijoo, CC BY-SA 4.0 <https://creativecommons.org/licenses/by-sa/4.0>, via Wikimedia Commons"
    },
    {
      name: "Lighthouse",
      assetUrl: "https://cdn.glitch.global/2185757e-0cf1-41da-b569-2852f58dd26d/2048px-Beautiful_January_morning_at_Cape_Hatteras_Lighthouse._(5d7d9068-1dd8-b71c-078a-4ba4477c0d49).jpg?v=1746649139924",
      credit:  "National Park Service, Public domain, via Wikimedia Commons"
    }
  ];
}

function computeOrientationMap(img) {
  img.loadPixels();
  const w = img.width, h = img.height;
  // 灰度数组
  let gray = new Float32Array(w*h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let i = 4*(y*w + x);
      let r = img.pixels[i], g = img.pixels[i+1], b = img.pixels[i+2];
      gray[y*w+x] = 0.299*r + 0.587*g + 0.114*b;
    }
  }
  // Sobel 卷积
  let orient = new Float32Array(w*h);
  for (let y = 1; y < h-1; y++) {
    for (let x = 1; x < w-1; x++) {
      let idx = y*w + x;
      // Gx
      let gx = 
        - gray[(y-1)*w + (x-1)] - 2*gray[y*w + (x-1)] - gray[(y+1)*w + (x-1)]
        +   gray[(y-1)*w + (x+1)] + 2*gray[y*w + (x+1)] +   gray[(y+1)*w + (x+1)];
      // Gy
      let gy = 
        - gray[(y-1)*w + (x-1)] - 2*gray[(y-1)*w + x] - gray[(y-1)*w + (x+1)]
        +   gray[(y+1)*w + (x-1)] + 2*gray[(y+1)*w + x] +   gray[(y+1)*w + (x+1)];
      orient[idx] = atan2(gy, gx);
    }
  }
  return {orient, w, h};
}

function initDesign(inspiration) {
  // 1) 缩放到原图的 1/5.5
  resizeCanvas(inspiration.image.width  / 5.5, inspiration.image.height / 5.5);
  
  // 2) 预计算“方向图”（Float32Array）
  const { orient, w: ow, h: oh } = computeOrientationMap(inspiration.image);

  $("#original").empty().append(
    `<img src="${inspiration.assetUrl}" style="width:${width}px;" />`
  );
  $(".caption").text(inspiration.credit);

  // 3) 离屏缓冲
  const pg = createGraphics(width, height);

  // 4) 是否对齐量化（仅在 Mondrian、Lighthouse 上锁定到 0/π/2/3π/2）
  const quantizeRotation = (
    inspiration.name === "Mondrian" ||
    inspiration.name === "Lighthouse"
  );

  // 5) 构造 design 对象
  let design = {
    fgLarge: [],           // 大方块
    fgSmall: [],           // 小方块
    orient,                // 梯度方向数组
    ow, oh,                // 原图宽高
    ratioX: ow  / width,   // 画布->原图 映射比例
    ratioY: oh  / height,
    pg,                    // 离屏缓冲
    dirty: true,           // 是否需要重绘缓存
    bg: 128,               // 灰度背景
    quantizeRotation       // 量化开关
  };

  // 6) 填充 100 个大方块（20%~50% 尺寸范围）
  randomSeed(0);
  for (let i = 0; i < 100; i++) {
    design.fgLarge.push({
      x: random(width),
      y: random(height),
      w: random(width  * 0.2, width  * 0.5),
      h: random(height * 0.2, height * 0.5)
    });
  }
  // 7) 填充 1000 个小方块（2%~10% 尺寸范围）
  for (let i = 0; i < 1000; i++) {
    design.fgSmall.push({
      x: random(width),
      y: random(height),
      w: random(width  * 0.02, width  * 0.1),
      h: random(height * 0.02, height * 0.1)
    });
  }

  return design;
}

// 把 box 绘制到 pg 上
function drawBoxTo(pg, box, design, insp) {
  const cx = floor((box.x + box.w / 2) * design.ratioX);
  const cy = floor((box.y + box.h / 2) * design.ratioY);
  const ix = constrain(cx, 0, design.ow - 1);
  const iy = constrain(cy, 0, design.oh - 1);
  const c = insp.image.get(ix, iy);
  const ang = design.orient[iy * design.ow + ix];

  pg.push();
  pg.translate(box.x + box.w / 2, box.y + box.h / 2);
  pg.rotate(ang);
  pg.noStroke();
  pg.fill(c);
  pg.rect(-box.w / 2, -box.h / 2, box.w, box.h);
  pg.pop();
}

// 重新渲染离屏缓冲
function redrawBuffer(design, inspiration) {
  const pg = design.pg;
  pg.background(design.bg);
  for (let box of design.fgLarge)  drawBoxTo(pg, box, design, inspiration);
  for (let box of design.fgSmall)  drawBoxTo(pg, box, design, inspiration);
  design.dirty = false;
}

function renderDesign(design, inspiration) {
  // 1) 如果标记需要重绘，更新离屏缓冲
  if (design.dirty) {
    const pg = design.pg;
    pg.background(design.bg);
    pg.noStroke();

    // 内部绘制函数：采样→量化→旋转→绘制
    function drawBox(box) {
      // 1.1) 计算画布中心对应的原图像素坐标
      const cx = floor((box.x + box.w/2) * design.ratioX);
      const cy = floor((box.y + box.h/2) * design.ratioY);
      const ix = constrain(cx, 0, design.ow - 1);
      const iy = constrain(cy, 0, design.oh - 1);

      // 1.2) 采色 & 取梯度方向
      const c      = inspiration.image.get(ix, iy);
      const rawAng = design.orient[iy * design.ow + ix];

      // 1.3) 如果需要量化，对齐到最近的 0/π/2/3π/2
      const ang = design.quantizeRotation
        ? Math.round(rawAng / (PI/2)) * (PI/2)
        : rawAng;

      // 1.4) 带旋转绘制到离屏缓冲
      pg.push();
      pg.translate(box.x + box.w/2, box.y + box.h/2);
      pg.rotate(ang);
      pg.fill(c);
      pg.rect(-box.w/2, -box.h/2, box.w, box.h);
      pg.pop();
    }

    // 2) 分层：先大方块，再小方块
    for (let b of design.fgLarge) drawBox(b);
    for (let b of design.fgSmall) drawBox(b);

    design.dirty = false;
  }

  // 2) 快速 blit 到主画布
  image(design.pg, 0, 0);
}

// 突变：高斯 + 标记 dirty
function mutateDesign(design, inspiration, baseRate) {
  // 模拟退火
  const rate = baseRate * exp(-frameCount * 0.001);

  function m(v, min, max) {
    const sd = (rate * (max - min)) / 10;
    return constrain(randomGaussian(v, sd), min, max);
  }

  design.bg = m(design.bg, 0, 255);

  // 大方块
  for (let b of design.fgLarge) {
    b.x = m(b.x, 0, width);
    b.y = m(b.y, 0, height);
    b.w = m(b.w, width * 0.2, width * 0.5);
    b.h = m(b.h, height * 0.2, height * 0.5);
  }
  // 小方块
  for (let b of design.fgSmall) {
    b.x = m(b.x, 0, width);
    b.y = m(b.y, 0, height);
    b.w = m(b.w, width * 0.02, width * 0.1);
    b.h = m(b.h, height * 0.02, height * 0.1);
  }

  design.dirty = true;
}

function mut(num, min, max, rate) {
  return constrain(randomGaussian(num, (rate * (max - min)) / 10), min, max);
}
