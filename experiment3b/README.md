**Description**: 
- This generator uses Perlin noise to carve out coherent grass and water biomes on a pitch‑black canvas, then sparsely populates the land with trees.
- Half of the grass and water tiles animate in a subtle loop to simulate breezes and ripples, while the others remain pure static colors—resulting in a natural, non‑uniform appearance. 


**Codes**:
- `.` — Grass tile (coordinates **0,0 / 1,0 / 2,0** in tileset)  
- `~` — Water tile (coordinates **0,13 / 1,13 / 2,13**)  
- `T` — Tree (tileset region **ti = 20…27**, **tj = 3…7**) 

**Life**:
- Perlin‑noise‑driven frames cycle on half the grass/water tiles (others stay static) for a gentle waving effect.  
- Semi‑transparent white overlays move across grass/trees via noise + `millis()`.  
- Each run scatters trees with varied sprites, so no two maps look the same.  
- Tweak the ASCII map live—add/remove `.` / `~` / `T` and watch the canvas update at 60 FPS.

(using tiles from [Micro Tileset - Overworld & Dungeon](https://thkaspar.itch.io/micro-tileset-overworld-dungeon) by [thkaspar](https://thkaspar.itch.io/))
