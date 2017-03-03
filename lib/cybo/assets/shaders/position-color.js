define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function PositionColor() {
        // No contents.
    }

    //
    // Static constants (after Object.freeze()).
    //
    PositionColor.VERTEX_SHADER_SOURCE = (
    "   //                                                                 \n" +
    "   attribute vec3 vertexPosition;                                     \n" +
    "   attribute vec4 vertexColor;                                        \n" +
    "   uniform mat4 transform;                                            \n" +
    "                                                                      \n" +
    "   varying lowp vec4 color;                                           \n" +
    "                                                                      \n" +
    "   void main() {                                                      \n" +
    "       gl_Position = transform * vec4(vertexPosition, 1.0);           \n" +
    "       color = vertexColor;                                           \n" +
    "   }                                                                  \n"
    );

    PositionColor.FRAGMENT_SHADER_SOURCE = (
    "   //                                                                 \n" +
    "   varying lowp vec4 color;                                           \n" +
    "                                                                      \n" +
    "   void main() {                                                      \n" +
    "       gl_FragColor = color;                                          \n" +
    "   }                                                                  \n"
    );

    Object.freeze(PositionColor);
    return PositionColor;
});
