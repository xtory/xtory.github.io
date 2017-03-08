// Note:
// WebGL viewport's (X, Y) means the lower-left corner.
// DirectX viewport's (X, Y) means the upper-left corner.

import { DepthBufferValues } from './depth-buffer-values';

//
// Constructor.
//
function Viewport(_left, _bottom, _width, _height) {
    //
    this.left = _left;
    this.bottom = _bottom;
    this.width = _width;
    this.height = _height;

    Object.defineProperty(this, 'aspectRatio', {
        get: function() { return _width / _height; }
    });
}

//
// Prototype.
//
Viewport.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
Viewport.MIN_DEPTH = DepthBufferValues.NEAR_CLIP_PLANE;
Viewport.MAX_DEPTH = DepthBufferValues.FAR_CLIP_PLANE;

Object.freeze(Viewport);

export { Viewport };
