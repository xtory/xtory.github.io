//
// Constructor.
//
function PrimitiveType() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
PrimitiveType.LINE_LIST      = 1; // = WebGLRenderingContext.LINES
PrimitiveType.LINE_STRIP     = 3; // = WebGLRenderingContext.LINE_STRIP
PrimitiveType.TRIANGLE_LIST  = 4; // = WebGLRenderingContext.TRIANGLES
PrimitiveType.TRIANGLE_STRIP = 5; // = WebGLRenderingContext.TRIANGLE_STRIP

Object.freeze(PrimitiveType);

export { PrimitiveType };
