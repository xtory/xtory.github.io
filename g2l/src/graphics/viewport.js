// Note:
// OpenGL viewport's (X, Y) means the lower-left corner.
// DirectX viewport's (X, Y) means the upper-left corner.

// Note:
// DirectX uses Viewport to set
// { left, top, width, height, minDepth(near), maxDepth(far) }
// OpenGL uses gl.viewport() to set { left, bottom, width, height }
// and gl.depthRange() to set { nearDepth, farDepth }

// Note:
// Every canvas has 2 sizes. The size of its drawing buffer. This is how many pixels
// are in the canvas. The second size is the size the canvas is displayed. CSS
// determines the size the canvas is displayed. We can get the first size by canvas.
// width and height; get the second size by canvas.clientWidth and clientHeight.
// Without usnig gl.viewport(), the viewport defaults to (0, 0, canvas.width,
// canvas.height). In this engine, canvas.width/height are both constant values:
// 1024. Only canvas.clientWidth/clientHeight could change. That is, viewport size
// is also a constant value, which is (0, 0, canvas.width, canvas.height) = (0, 0,
// 1024, 1024).

// Note:
// Because viewport is always (0, 0, 1024, 1024), we don't use it like we do in
// Direct3D. Instead, we use canvas.clientWidth and clientHeight to get the viewport
// size for displaying (not for drawing).

//
// Constructor.
//
function Viewport(_left, _bottom, _width, _height) {
    //
    this.left   = _left;
    this.bottom = _bottom;
    this.width  = _width;
    this.height = _height;
}

Object.defineProperty(Viewport.prototype, 'aspectRatio', {
    get: function() { return this.width / this.height; }
});

Object.freeze(Viewport);

export { Viewport };
