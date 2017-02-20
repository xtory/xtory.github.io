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
    // Constants.
    //
    Object.defineProperty(PositionColor, "VERTEX_SHADER_SOURCE", {
        //
        get: function() { return (
        "   //                                                             \n" +        
        "   attribute vec3 vertexPosition;                                 \n" +
        "   attribute vec4 vertexColor;                                    \n" +
        "   uniform mat4 transform;                                        \n" +
        "   varying lowp vec4 color;                                       \n" +
        "                                                                  \n" +
        "   void main() {                                                  \n" +
        "       gl_Position = transform * vec4(vertexPosition, 1.0);       \n" +
        "       color = vertexColor;                                       \n" +
        "   }                                                              \n"
        ); }
    });

    Object.defineProperty(PositionColor, "FRAGMENT_SHADER_SOURCE", {
        //
        get: function() { return (
        "   //                                                             \n" +
        "   varying lowp vec4 color;                                       \n" +
        "                                                                  \n" +
        "   void main() {                                                  \n" +
        "       gl_FragColor = color;                                      \n" +
        "   }                                                              \n"
        ); }
    });

    return PositionColor;
});
