import { MathHelper } from '../math/helpers/math-helper';

// Note:
// Whether in OpenGL or DirectX, depth buffers have values 0 ~ 1, and conventionally,
// 0: near plane, 1: far plane. We can change it (such as: using gl.depthRange()
// or device.Viewport), but don't change it.

//
// Constructor.
//
function DepthBufferValues() {
    // No contents.
}

//
// Static constants.
//
DepthBufferValues.NEAR_CLIP_PLANE = 0.0; // = default zNear of gl.getParameter(gl.DEPTH_RANGE).
DepthBufferValues.FAR_CLIP_PLANE  = 1.0; // = default zFar of gl.getParameter(gl.DEPTH_RANGE).

//
// Static methods.
//
DepthBufferValues.isDepthOutOfRange = function(depth) {
    //
    if (// Part 1.
        MathHelper.isScalar1LessThanScalar2 (
            depth,
            DepthBufferValues.NEAR_CLIP_PLANE // = 0.0
        ) === true ||
        // Part 2.
        MathHelper.isScalar1LessThanScalar2 (
            DepthBufferValues.FAR_CLIP_PLANE, // = 1.0
            depth
        ) === true) {
        //
        return true;

    } else {
        //
        return false;
    }
};

export { DepthBufferValues };
