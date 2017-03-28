//
// Constructor.
//
function DepthBufferValues() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
DepthBufferValues.NEAR_CLIP_PLANE = 0.0; // = default zNear of gl.getParameter(gl.DEPTH_RANGE).
DepthBufferValues.FAR_CLIP_PLANE  = 1.0; // = default zFar of gl.getParameter(gl.DEPTH_RANGE).

Object.freeze(DepthBufferValues);

export { DepthBufferValues };
