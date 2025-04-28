// World 2: Futuristic - my_world.js
var worldSeed;
var baseHue, roadHueRange, blockSize;
var noiseXoff, noiseYoff;
var clickedTiles = {};  // 记录点击状态

function p3_preload() {
  // 不需要预加载资源
}

function p3_setup() {
  // 使用HSB色彩模式方便颜色变化控制
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function p3_worldKeyChanged(key) {
  // 计算worldSeed（基于worldKey的哈希，使得每个key生成独特世界）
  worldSeed = XXH.h32(key, 0).toNumber();
  // 用worldSeed设置随机和噪声，使随机结果可复现
  randomSeed(worldSeed);
  noiseSeed(worldSeed);
  // 基于seed随机确定道路网格大小和基础色调
  blockSize = floor(random(4, 9));           // 道路区块大小（4~8的整数）
  baseHue = random(0, 360);                  // 基础色调（道路霓虹颜色中心）
  roadHueRange = 60;                         // 道路颜色变化范围
  // 噪声偏移使空间变化随key改变
  noiseXoff = random(0, 1000);
  noiseYoff = random(0, 1000);
  // 重置点击记录
  clickedTiles = {};
}

function p3_tileWidth() {
  return 50;  // 基础网格宽度
}

function p3_tileHeight() {
  return 25;  // 网格高度较小，实现等距投影效果
}

function p3_tileClicked(i, j) {
  // 点击切换建筑状态：记录点击次数用于判断奇偶
  var key = i + "," + j;
  if (clickedTiles[key]) {
    clickedTiles[key] += 1;
  } else {
    clickedTiles[key] = 1;
  }
}

function p3_drawBefore() {
  // 绘制背景为黑色，突出霓虹效果
  background(0, 0, 0);
}

function p3_drawTile(i, j) {
  // 计算当前tile中心相对于tile局部坐标
  var W = p3_tileWidth();
  var H = p3_tileHeight();
  // 判断是否为道路tile（根据blockSize周期）
  var isRoad = (i % blockSize === 0) || (j % blockSize === 0);
  if (isRoad) {
    // 道路：霓虹色动态变化（色相围绕baseHue来回变化）
    var hue = baseHue + roadHueRange * sin(millis() * 0.001);
    hue = (hue + 360) % 360;
    fill(hue, 80, 90);  // 明亮的霓虹道路
  } else {
    // 建筑：使用深色基调，微妙变化表示高度/材质差异
    var noiseVal = noise(i * 0.3 + noiseXoff, j * 0.3 + noiseYoff);
    var buildingBrightness = 15 + noiseVal * 10;  // 15~25亮度
    fill(baseHue, 20, buildingBrightness);        // 暗色调，略带色彩
  }
  // 绘制菱形tile区域
  push();
  beginShape();
  vertex(W/2, 0);
  vertex(W, H/2);
  vertex(W/2, H);
  vertex(0, H/2);
  endShape(CLOSE);
  pop();

  // 如果是建筑tile，绘制动态灯光/天线等细节
  if (!isRoad) {
    var centerX = W / 2;
    var centerY = H / 2;
    if (clickedTiles[i + "," + j] && clickedTiles[i + "," + j] % 2 === 1) {
      // 若建筑被点击激活：持续亮起的标志灯（黄色）
      fill(60, 100, 100);
      noStroke();
      ellipse(centerX, centerY, 6, 6);
    } else {
      // 未激活建筑：顶部灯光随机闪烁（白色），利用噪声随时间变化
      var blinkVal = noise(i * 0.1 + 1000, j * 0.1 + 2000, millis() * 0.002);
      if (blinkVal > 0.5) {
        fill(0, 0, 100);
        noStroke();
        ellipse(centerX, centerY, 6, 6);
      }
    }
  }
}

function p3_drawSelectedTile(i, j) {
  // 高亮当前鼠标悬停的tile边缘
  var W = p3_tileWidth();
  var H = p3_tileHeight();
  push();
  noFill();
  stroke(0, 0, 100);
  strokeWeight(2);
  beginShape();
  vertex(W/2, 0);
  vertex(W, H/2);
  vertex(W/2, H);
  vertex(0, H/2);
  endShape(CLOSE);
  pop();
}