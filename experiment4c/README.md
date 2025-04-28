## Artist Statement

Infinite Chaos Grid is a dive into the raw pulse of digital entropy. 
I envisioned a world where each tile bursts with unpredictable energy lines 
that twist, flicker, and collide—an endless mosaic of controlled chaos. 
By remixing per‑tile random seeds with noise and sine oscillations, 
every little square becomes a unique dynamo: a living, electric cell in a vast, unbounded network. 
Hovering your cursor cranks up the agitation, 
while clicking releases a shockwave ripple that momentarily disturbs the surrounding mayhem. 
The result is a hypnotic tableau of frenetic motion—structured enough to feel cohesive, yet untamable in its details.

This world is inspired by colored ribbons.


## Technical Description

This world uses p5.js and xxHash to hash the user’s key into a single worldSeed, 
which—combined with each tile’s (i,j) coordinates—initializes 2–5 energy “filaments” per tile. 
Those filaments’ angles and lengths continuously oscillate via sine functions with individual phase and amplitude parameters, 
and they’re drawn in two complementary hues with randomized saturation and brightness. 
Hovering over a tile boosts its oscillation amplitude, 
while clicking it emits a 0.5 s expanding shockwave ring. 
All of this runs on an infinite isometric diamond grid (50×50 px) that you can pan endlessly with arrow keys, 
with off-screen tiles generated on the fly from their deterministic seeds to create a seamless yet beautiful chaos.