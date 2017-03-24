//
// Constructor.
//
function Multitexturing() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
Multitexturing.VERTEX_SHADER_SOURCE = [
    //
   'attribute highp vec3 vertexPosition;',
   'attribute highp vec2 vertexTextureCoordinates;',
    //
   'uniform highp mat4 transform;',
    //
   'varying highp vec2 textureCoordinates;',
    //
   'void main() {',
        //
       'gl_Position = transform * vec4(vertexPosition, 1.0);',
       'textureCoordinates = vertexTextureCoordinates;',
   '}'

].join('\n');

Multitexturing.FRAGMENT_SHADER_SOURCE = [
    //
   'varying highp vec2 textureCoordinates;',
    //
   'uniform sampler2D sampler1;',
   'uniform sampler2D sampler2;',
    //
   'void main() {',
        //
       'gl_FragColor = (',
           'texture2D(sampler1, textureCoordinates) *',
           'texture2D(sampler2, textureCoordinates)',
       ');',
   '}'

].join('\n');

Object.freeze(Multitexturing);
