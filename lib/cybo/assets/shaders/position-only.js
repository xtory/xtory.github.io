define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    function PositionOnly() {
        // No contents.
    }

    //
    // Static constants (after Object.freeze()).
    //
    PositionOnly.VERTEX_SHADER_SOURCE = (
    "   //                                                                 \n" +
    "   attribute vec3 vertexPosition;                                     \n" +
    "   uniform mat4 transform;                                            \n" +
    "                                                                      \n" +
    "   void main() {                                                      \n" +
    "       gl_Position = transform * vec4(vertexPosition, 1.0);           \n" +
    "   }                                                                  \n"
    );

    PositionOnly.FRAGMENT_SHADER_SOURCE = (
    "   //                                                                 \n" +
    "   void main() {                                                      \n" +
    "       gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);                       \n" +
    "   }                                                                  \n"
    );    

    Object.freeze(PositionOnly);
    return PositionOnly;
});
