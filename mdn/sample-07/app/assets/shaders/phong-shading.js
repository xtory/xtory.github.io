define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function PhongShading() {
        // No contents.
    }

    //
    // Constants.
    //
    Object.defineProperty(PhongShading, "VERTEX_SHADER_SOURCE", {
        //
        get: function() { return (
        "   //                                                             \n" +
        "   attribute highp vec3 vertexPosition;                           \n" +
        "   attribute highp vec3 vertexNormal;                             \n" +
        "   attribute highp vec2 vertexTextureCoordinates;                 \n" +
        "                                                                  \n" +
        "   uniform highp mat4 normalMatrix;                               \n" +
        "   uniform highp mat4 transform;                                  \n" +
        "                                                                  \n" +
        "   varying highp vec2 textureCoordinates;                         \n" +
        "   varying highp vec3 lighting;                                   \n" +
        "                                                                  \n" +
        "   void main() {                                                  \n" +
        "       //                                                         \n" +
        "       gl_Position = transform * vec4(vertexPosition, 1.0);       \n" +
        "       textureCoordinates = vertexTextureCoordinates;             \n" +
        "                                                                  \n" +
        "       // Apply lighting effect                                   \n" +
        "       highp vec3 ambientLight = vec3(0.6, 0.6, 0.6);             \n" +
        "       highp vec3 directionalLightColor = vec3(0.5, 0.5, 0.75);   \n" +
        "       highp vec3 directionalVector = vec3(0.85, 0.8, 0.75);      \n" +
        "                                                                  \n" +
        "       highp vec4 transformedNormal =                             \n" +
        "           normalMatrix * vec4(vertexNormal, 1.0);                \n" +
        "                                                                  \n" +
        "       highp float directional = max (                            \n" +
        "           dot(transformedNormal.xyz, directionalVector),         \n" +
        "           0.0                                                    \n" +
        "       );                                                         \n" +
        "                                                                  \n" +
        "       lighting = (                                               \n" +
        "           ambientLight +                                         \n" +
        "           (directionalLightColor * directional)                  \n" +
        "       );                                                         \n" +
        "   }                                                              \n"
        ); }
    });

    Object.defineProperty(PhongShading, "FRAGMENT_SHADER_SOURCE", {
        //
        get: function() { return (
        "   //                                                             \n" +
        "   varying highp vec2 textureCoordinates;                         \n" +
        "   varying highp vec3 lighting;                                   \n" +
        "                                                                  \n" +
        "   uniform sampler2D sampler;                                     \n" +
        "                                                                  \n" +
        "   void main() {                                                  \n" +
        "       //                                                         \n" +
        "       mediump vec4 texelColor = texture2D (                      \n" +
        "           sampler,                                               \n" +
        "           vec2(textureCoordinates.s, textureCoordinates.t)       \n" +
        "       );                                                         \n" +
        "                                                                  \n" +
        "       gl_FragColor =                                             \n" +
        "           vec4(texelColor.rgb * lighting, texelColor.a);         \n" +
        "   }                                                              \n"
        ); }
    });

    return PhongShading;
});