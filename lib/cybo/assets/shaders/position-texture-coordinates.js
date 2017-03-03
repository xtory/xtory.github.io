define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function PositionTextureCoordinates() {
        // No contents.
    }

    //
    // Static constants (after Object.freeze()).
    //
    PositionTextureCoordinates.VERTEX_SHADER_SOURCE = (
    "   //                                                                 \n" +
    "   attribute vec3 vertexPosition;                                     \n" +
    "   attribute vec2 vertexTextureCoordinates;                           \n" +
    "   uniform mat4 transform;                                            \n" +
    "                                                                      \n" +
    "   varying highp vec2 textureCoordinates;                             \n" +
    "                                                                      \n" +
    "   void main() {                                                      \n" +
    "       gl_Position = transform * vec4(vertexPosition, 1.0);           \n" +
    "       textureCoordinates = vertexTextureCoordinates;                 \n" +
    "   }                                                                  \n"
    );

    PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = (
    "   //                                                                 \n" +
    "   varying highp vec2 textureCoordinates;                             \n" +
    "   uniform sampler2D sampler;                                         \n" +
    "                                                                      \n" +
    "   void main() {                                                      \n" +
    "       gl_FragColor = texture2D(sampler, textureCoordinates);         \n" +
    "   }                                                                  \n"
    );

    Object.freeze(PositionTextureCoordinates);
    return PositionTextureCoordinates;
});
