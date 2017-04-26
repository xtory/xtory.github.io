//
// Constructor.
//
function PrimitiveType() {
    // No contents.
}

//
// Static constants.
//
PrimitiveType.LINE_LIST      = 1; // = gl.LINES
PrimitiveType.LINE_STRIP     = 3; // = gl.LINE_STRIP
PrimitiveType.TRIANGLE_LIST  = 4; // = gl.TRIANGLES
PrimitiveType.TRIANGLE_STRIP = 5; // = gl.TRIANGLE_STRIP

export { PrimitiveType };
