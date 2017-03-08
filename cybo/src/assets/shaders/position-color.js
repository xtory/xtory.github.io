// define ([
//     // No parameters.
// ], function (
//     // No parameters.
// ){
//     "use strict";
    
//
// Constructor.
//
function PositionColor() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
PositionColor.VERTEX_SHADER_SOURCE = [
    //
   "attribute vec3 vertexPosition;",
   "attribute vec4 vertexColor;",
   "uniform mat4 transform;",
    //
   "varying lowp vec4 color;",
    //
   "void main() {",
       "gl_Position = transform * vec4(vertexPosition, 1.0);",
       "color = vertexColor;",
   "}"

].join("\n");

PositionColor.FRAGMENT_SHADER_SOURCE = [
    //
   "varying lowp vec4 color;",
    //
   "void main() {",
       "gl_FragColor = color;",
   "}"

].join("\n");

Object.freeze(PositionColor);

//     return PositionColor;
// });

export { PositionColor };
