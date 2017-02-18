define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    function PositionOnly() {
        // No contents.
    }

    Object.defineProperty(PositionOnly, "VERTEX_SHADER_SOURCE", {
        //
        get: function() { return (
        "   //                                                             \n" +
        "   attribute vec3 vertexPosition;                                 \n" +
        "   uniform mat4 transform;                                        \n" +
        "                                                                  \n" +
        "   void main() {                                                  \n" +
        "       gl_Position = transform * vec4(vertexPosition, 1.0);       \n" +
        "   }                                                              \n"
        ); }
    });

    Object.defineProperty(PositionOnly, "FRAGMENT_SHADER_SOURCE", {
        //
        get: function() { return (
        "   //                                                             \n" +
        "   void main() {                                                  \n" +
        "       gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);                   \n" +
        "   }                                                              \n"
        ); }
    });    

    return PositionOnly;
});
