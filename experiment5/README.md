Image sources:
- [Mondrian](https://commons.wikimedia.org/wiki/File:Piet_Mondriaan,_1930_-_Mondrian_Composition_II_in_Red,_Blue,_and_Yellow.jpg)
- [Sunset](https://commons.wikimedia.org/wiki/File:Silhouette_Sunset.JPG)
- [Lighthouse](https://commons.wikimedia.org/wiki/File:Beautiful_January_morning_at_Cape_Hatteras_Lighthouse._(5d7d9068-1dd8-b71c-078a-4ba4477c0d49).jpg)

**Description**:
- This assignment straps a self-tuning image generator onto real photos. 
- I pick inspirations from the drop-down, the code samples its pixels and edge directions, then spawns hundreds of little shapes that layer and rotate to mimic the source. 
- It evaluates its own output against the original and keeps mutating until it gets as close as it can—no human in the loop besides flipping the switch.

**Technical**:
- Dynamic Inspiration: Three images live in the drop-down; swapping them reruns initDesign() with custom parameters (canvas size, buffer, quantized vs. free-form rotation).
- Multi-Scale, Orientation-Aware Rendering: I precompute a Sobel gradient map, then paint 100 large and 1000 small rectangles offscreen for speed. Each rectangle samples its center pixel and aligns to the local gradient (snapped to 0°/90° for rigid scenes or kept free for organic textures).
- Simulated Annealing & Mutation Control: A 30-second "anneal" drives exploration rapidly at first, then exponentially cools the mutation rate; sliding the "Mutation rate" slider toward 1% almost freezes evolution. New frames only redraw when designs actually change—rest are super-fast GPU blits.

**Reflection**:
- TBH, I was cringing at first - got the feature list done but the performance tanked. 
- Swapping to offscreen buffers and quantized rotations saved the day. 
- It still blows my mind that a handful of rectangles can approximate a photo. Next step: importance-sampling those rectangles so they swarm the worst pixels first.