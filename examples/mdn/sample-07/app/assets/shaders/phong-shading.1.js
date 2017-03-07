// define ([
//     // No parameters.
// ], function (
//     // No parameters.
// ){
//     "use strict";
    
//     //
//     // Constructor.
//     //
//     function PhongShading() {
//         // No contents.
//     }

//     //
//     // Static constants (after Object.freeze()).
//     //
//     PhongShading.VERTEX_SHADER_SOURCE = (
//     "   //                                                                 \n" +
//     "   attribute highp vec3 vertexPosition;                               \n" +
//     "   attribute highp vec3 vertexNormal;                                 \n" +
//     "   attribute highp vec2 vertexTextureCoordinates;                     \n" +
//     "                                                                      \n" +
//     "   uniform highp mat4 transposeOfInverseOfModelViewMatrix;            \n" +
//     "   uniform highp mat4 transform;                                      \n" +
//     "                                                                      \n" +
//     "   varying highp vec2 textureCoordinates;                             \n" +
//     "   varying highp vec3 lighting;                                       \n" +
//     "                                                                      \n" +
//     "   void main() {                                                      \n" +
//     "       //                                                             \n" +
//     "       gl_Position = transform * vec4(vertexPosition, 1.0);           \n" +
//     "       textureCoordinates = vertexTextureCoordinates;                 \n" +
//     "                                                                      \n" +
//     "       // Apply lighting effect                                       \n" +
//     "       highp vec3 ambientLight = vec3(0.25, 0.25, 0.25);              \n" +
//     "       highp vec3 directionalLightColor = vec3(1, 1, 1);              \n" +
//     "       highp vec3 directionalVector = vec3(1, 1, 1);                  \n" +
//     "                                                                      \n" +
//     "       highp vec4 transformedNormal = (                               \n" +
//     "           transposeOfInverseOfModelViewMatrix *                      \n" +
//     "           vec4(vertexNormal, 1.0)                                    \n" +
//     "       );                                                             \n" +
//     "                                                                      \n" +
//     "       highp float directional = max (                                \n" +
//     "           dot(transformedNormal.xyz, directionalVector),             \n" +
//     "           0.0                                                        \n" +
//     "       );                                                             \n" +
//     "                                                                      \n" +
//     "       lighting = (                                                   \n" +
//     "           ambientLight +                                             \n" +
//     "           (directionalLightColor * directional)                      \n" +
//     "       );                                                             \n" +
//     "   }                                                                  \n"
//     );

//     PhongShading.FRAGMENT_SHADER_SOURCE = (
//     "   //                                                                 \n" +
//     "   varying highp vec2 textureCoordinates;                             \n" +
//     "   varying highp vec3 lighting;                                       \n" +
//     "                                                                      \n" +
//     "   uniform sampler2D sampler;                                         \n" +
//     "                                                                      \n" +
//     "   void main() {                                                      \n" +
//     "       //                                                             \n" +
//     "       mediump vec4 texelColor =                                      \n" +
//     "           texture2D(sampler, textureCoordinates);                    \n" +
//     "                                                                      \n" +
//     "       gl_FragColor =                                                 \n" +
//     "           vec4(texelColor.rgb * lighting, texelColor.a);             \n" +
//     "   }                                                                  \n"
//     );

//     Object.freeze(PhongShading);
//     return PhongShading;
// });
