## Artist Statement

Infinite Neon Grid explores a high‑tech metropolis that never sleeps, 
where glowing highways carve neon veins across an endless isometric landscape. 
Drawing inspiration from sci‑fi cityscapes, I constructed a grid of illuminated roadways and dark modern structures, 
then injected life through rhythmic pulse and interactive beacons. Each roadway glimmers in shifting hues, 
while building rooftops flicker with random antenna lights. 
Clicking a building toggles its beacon, inviting you to sculpt the city’s skyline in real time.

This world is inspired by modern skyscrapers with neon lights.

## Technical Description

This world hashes the user’s key into a single worldSeed 
that seeds both noise and randomness to generate a reproducible, 
infinite isometric grid of 50×25 px diamonds; 
tiles whose row or column index is a multiple of a randomized blockSize become neon highways 
whose hue smoothly pulses around a base color via a sine of millis(),
while all other tiles are “buildings” shaded by 2D noise for subtle brightness variation 
and topped with antenna lights that blink according to a noise threshold. 
Clicking any building toggles a persistent yellow beacon at its center, 
and arrow‐key panning lets you scroll endlessly through this futuristic scape, 
blending deterministic procedural structure with dynamic, interactive lighting.
