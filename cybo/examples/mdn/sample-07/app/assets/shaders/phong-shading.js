//
// Constructor.
//
function PhongShading() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
PhongShading.VERTEX_SHADER_SOURCE = [
    //
   "attribute highp vec3 vertexPosition;",
   "attribute highp vec3 vertexNormal;",
   "attribute highp vec2 vertexTextureCoordinates;",
    //
   "uniform highp mat4 transposeOfInverseOfModelViewMatrix;",
   "uniform highp mat4 transform;",
    //
   "varying highp vec2 textureCoordinates;",
   "varying highp vec3 lighting;",
    //
   "void main() {",
        //
       "gl_Position = transform * vec4(vertexPosition, 1.0);",
       "textureCoordinates = vertexTextureCoordinates;",
        //
       "// Apply lighting effect",
       "highp vec3 ambientLight = vec3(0.25, 0.25, 0.25);",
       "highp vec3 directionalLightColor = vec3(1, 1, 1);",
       "highp vec3 directionalVector = vec3(1, 1, 1);",
        //
       "highp vec4 transformedNormal = (",
           "transposeOfInverseOfModelViewMatrix *",
           "vec4(vertexNormal, 1.0)",
       ");",
        //
       "highp float directional = max (",
           "dot(transformedNormal.xyz, directionalVector),",
           "0.0",
       ");",
        //
       "lighting = (",
           "ambientLight +",
           "(directionalLightColor * directional)",
       ");",
   "}"

].join("\n");

PhongShading.FRAGMENT_SHADER_SOURCE = [
    //
   "varying highp vec2 textureCoordinates;",
   "varying highp vec3 lighting;",
    //
   "uniform sampler2D sampler;",
    //
   "void main() {",
        //
       "mediump vec4 texelColor =",
       "texture2D(sampler, textureCoordinates);",
        //
       "gl_FragColor =",
       "vec4(texelColor.rgb * lighting, texelColor.a);",
   "}"

].join("\n");

Object.freeze(PhongShading);

//export { PhongShading };
