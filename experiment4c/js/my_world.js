// World 3: Chaotic - my_world.js
var worldSeed;
var baseHue, secondHue;
var clickedTiles = {};    // 记录最后一次点击时间
var selectedTile = null;  // 当前鼠标悬停的tile坐标
var lineConfigs = {};     // 缓存每个tile的线条基准配置

function p3_preload() {
  // 无需预加载资源
}

function p3_setup() {
  // 使用HSB颜色模式
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

function p3_worldKeyChanged(key) {
  // 生成worldSeed并重置状态
  worldSeed = XXH.h32(key, 0).toNumber();
  randomSeed(worldSeed);
  noiseSeed(worldSeed);
  // 确定颜色方案：主色调和对比色调
  baseHue = random(0, 360);
  secondHue = (baseHue + 180) % 360;
  clickedTiles = {};
  lineConfigs = {};
}

function p3_tileWidth() {
  return 50;  // Tile大小
}

function p3_tileHeight() {
  return 50;
}

function p3_tileClicked(i, j) {
  // 记录点击时间，用于触发局部爆炸效果
  clickedTiles[i + "," + j] = millis();
}

function p3_drawBefore() {
  // 深色背景烘托混乱能量
  background(0, 0, 5);
}

function p3_drawTile(i, j) {
  var W = p3_tileWidth();
  var H = p3_tileHeight();
  var key = i + "," + j;
  // 获取或生成该tile的线条配置（确保对每个tile一致且随seed变化）
  if (!lineConfigs[key]) {
    // 基于tile坐标和worldSeed设定随机种子，生成线条集
    randomSeed(worldSeed + i * 131071 + j * 95791);
    var lineCount = floor(random(2, 6));  // 每tile随机2-5组能量线
    var configs = [];
    for (var n = 0; n < lineCount; n++) {
      // 每条线/射线随机起点、角度、长度及动态参数
      var originX = random(0.2, 0.8) * W;    // 起点在tile内部(归一化0.2~0.8避免紧贴边缘)
      var originY = random(0.2, 0.8) * H;
      var baseAngle = random(TWO_PI);
      var baseLength = random(W * 0.2, W * 0.5);
      // 动态变化速度和幅度
      var angleSpeed = random(0.005, 0.02);
      var anglePhase = random(0, TWO_PI);
      var angleAmp = random(0.1, 0.4);
      var lengthSpeed = random(0.005, 0.02);
      var lengthPhase = random(0, TWO_PI);
      var lengthAmp = random(0.1, 0.3) * baseLength;
      // 颜色和线粗
      var useSecondColor = random() < 0.5;
      var hue = useSecondColor ? secondHue : baseHue;
      hue = (hue + random(-30, 30) + 360) % 360;
      var sat = 100;
      var bri = random(70, 100);
      var lineWeight = random([1, 2]);  // 1或2像素宽
      configs.push({
        ox: originX, oy: originY,
        baseAngle: baseAngle, baseLength: baseLength,
        angleSpeed: angleSpeed, anglePhase: anglePhase, angleAmp: angleAmp,
        lengthSpeed: lengthSpeed, lengthPhase: lengthPhase, lengthAmp: lengthAmp,
        hue: hue, sat: sat, bri: bri, weight: lineWeight
      });
    }
    lineConfigs[key] = configs;
  }

  // 绘制tile背景（深色基底）
  fill(0, 0, 10);
  push();
  beginShape();
  vertex(W/2, 0);
  vertex(W, H/2);
  vertex(W/2, H);
  vertex(0, H/2);
  endShape(CLOSE);
  pop();

  // 绘制该tile内的能量线条（动态变化）
  var configs = lineConfigs[key];
  for (var k = 0; k < configs.length; k++) {
    var cfg = configs[k];
    // 计算随时间扰动的角度和长度
    var t = millis();
    var angleOffset = sin(t * cfg.angleSpeed + cfg.anglePhase) * cfg.angleAmp;
    var lengthOffset = sin(t * cfg.lengthSpeed + cfg.lengthPhase) * cfg.lengthAmp;
    var angle = cfg.baseAngle + angleOffset;
    var length = cfg.baseLength + lengthOffset;
    // 如果此tile被鼠标悬停，增强扰动幅度（能量受扰动更剧烈）
    if (selectedTile && selectedTile[0] === i && selectedTile[1] === j) {
      length *= 1.2;
      angleOffset *= 1.5;
      angle = cfg.baseAngle + angleOffset;
    }
    // 计算线段终点坐标
    var x0 = cfg.ox;
    var y0 = cfg.oy;
    var x1 = x0 + length * cos(angle);
    var y1 = y0 + length * sin(angle);
    // 限制线段在tile范围内：如果超出边界则截断到边缘
    if (x1 < 0) x1 = 0;
    if (x1 > W) x1 = W;
    if (y1 < 0) y1 = 0;
    if (y1 > H) y1 = H;
    // 绘制线条
    stroke(cfg.hue, cfg.sat, cfg.bri);
    strokeWeight(cfg.weight);
    line(x0, y0, x1, y1);
    noStroke();
  }

  // 若该tile最近被点击，绘制短暂的爆炸冲击波效果
  if (clickedTiles[key]) {
    var elapsed = millis() - clickedTiles[key];
    if (elapsed < 500) {
      // 500ms内画一个由中心扩散的圆环
      var prog = elapsed / 500.0;
      var radius = prog * (W * 0.8);
      stroke(0, 0, 100, (1 - prog) * 100);  // 白色光环，逐渐淡出
      strokeWeight(2);
      noFill();
      ellipse(W/2, H/2, radius, radius);
      noStroke();
    }
  }
}

function p3_drawSelectedTile(i, j) {
  // 记录当前悬停tile坐标，用于在drawTile中加剧该tile的动态效果
  selectedTile = [i, j];
  // 可选：高亮选中tile边缘（视觉提示）
  var W = p3_tileWidth();
  var H = p3_tileHeight();
  push();
  noFill();
  stroke(60, 100, 100);
  strokeWeight(2);
  beginShape();
  vertex(W/2, 0);
  vertex(W, H/2);
  vertex(W/2, H);
  vertex(0, H/2);
  endShape(CLOSE);
  pop();
}
