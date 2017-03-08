// define ([
//     // No parameters.
// ], function (
//     // No parameters.
// ){
//     "use strict";
    
//
// Constructor.
//
function PositionTextureCoordinates() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
PositionTextureCoordinates.VERTEX_SHADER_SOURCE = [
    //
   "attribute vec3 vertexPosition;",
   "attribute vec2 vertexTextureCoordinates;",
   "uniform mat4 transform;",
    //
   "varying highp vec2 textureCoordinates;",
    //
   "void main() {",
       "gl_Position = transform * vec4(vertexPosition, 1.0);",
       "textureCoordinates = vertexTextureCoordinates;",
   "}"

].join("\n");

PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = [
    //
   "varying highp vec2 textureCoordinates;",
   "uniform sampler2D sampler;",
    //
   "void main() {",
       "gl_FragColor = texture2D(sampler, textureCoordinates);",
   "}"
   
].join("\n");

Object.freeze(PositionTextureCoordinates);

//     return PositionTextureCoordinates;
// });

export { PositionTextureCoordinates };
