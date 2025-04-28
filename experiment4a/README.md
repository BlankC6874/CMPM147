## Artist Statement

I harness the iconic four-color Microsoft logo palette—not as a corporate badge,
but as building blocks in an infinite, rule-based playground.
Every 4×4 tile grid hides a perfect 2×2 logo motif: green, red, yellow, and blue diamonds stand tightly together, 
then dissolve into a classic black-and-white chessboard before the pattern repeats.
Each color block combined like a canvas gently floats, responding to your mouse movement,
while an orchestrated glow sequence (red → green+blue → yellow) dances through the grid in a rhythmic cycle.

<sup>Thanks Microsoft for their beautiful logo (I guess).</sup>

## Technical Description

Built with p5.js and xxHash for deterministic worlds, 
the sketch generates an infinite isometric grid of 32×16 px diamonds seeded by a user‐supplied key 
(hashed to worldSeed for reproducible noise and randomness). 
Every 4×4 block’s center 2×2 diamonds form a Microsoft‐logo color motif (green, red, yellow, blue) 
while the rest display a black-and-white chessboard pattern. 
Each tile individually “floats” up to ±5 px in response to real-time mouse position, 
color blocks run a synced three-phase glow cycle (red → green+blue → yellow, each glowing for 100 ms with a 1 s pause), 
and clicking any color block triggers a quick 0.5 s white flash—using millis() for seamless infinite looping.
