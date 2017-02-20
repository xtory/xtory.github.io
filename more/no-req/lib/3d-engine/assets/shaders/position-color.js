"use strict";

function PositionColor() {
    // No contents.
}

Object.defineProperty(PositionColor, "VERTEX_SHADER_SOURCE", {
    //
    get: function() { return (
    "   //                                                              \n" +
    "   attribute vec3 vertexPosition;                                  \n" +
    "   uniform mat4 transform;                                         \n" +
    "                                                                   \n" +
    "   void main(void) {                                               \n" +
    "       gl_Position = transform * vec4(vertexPosition, 1.0);        \n" +
    "   }                                                               \n"
    ); }
});

Object.defineProperty(PositionColor, "FRAGMENT_SHADER_SOURCE", {
    //
    get: function() { return (
    "   //                                                              \n" +
    "   void main(void) {                                               \n" +
    "       gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);                    \n" +
    "   }                                                               \n"
    ); }
});
