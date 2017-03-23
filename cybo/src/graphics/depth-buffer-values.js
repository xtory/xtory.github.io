//
// Constructor.
//
function DepthBufferValues() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
DepthBufferValues.NEAR_CLIP_PLANE = 0.0; // = Viewport.MIN_DEPTH
DepthBufferValues.FAR_CLIP_PLANE = 1.0; // = Viewport.MAX_DEPTH

Object.freeze(DepthBufferValues);

export { DepthBufferValues };
