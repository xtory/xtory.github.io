//
// Constructor.
//
function PositionOnly() {
    // No contents.
}

//
// Prototype.
//
PositionOnly.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
PositionOnly.VERTEX_SHADER_SOURCE = [
    //
   "attribute vec3 vertexPosition;",
   "uniform mat4 transform;",
    //
   "void main() {",
       "gl_Position = transform * vec4(vertexPosition, 1.0);",
   "}"
   
].join("\n");

PositionOnly.FRAGMENT_SHADER_SOURCE = [
    //
   "void main() {",
       "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
   "}"

].join("\n");

Object.freeze(PositionOnly);

export { PositionOnly };
