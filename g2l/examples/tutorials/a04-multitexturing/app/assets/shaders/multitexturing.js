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
   'precision highp float;', // which is the default vertex shader precision.

   'attribute vec3 vertexPosition;',
   'attribute vec2 vertexTextureCoordinates;',
    //
   'uniform mat4 transform;',
    //
   'varying vec2 textureCoordinates;',
    //
   'void main() {',
        //
       'gl_Position = transform * vec4(vertexPosition, 1.0);',
       'textureCoordinates = vertexTextureCoordinates;',
   '}'

].join('\n');

Multitexturing.FRAGMENT_SHADER_SOURCE = [
    //
   'precision mediump float;', // which is the recommended fragment shader precision.
    // 
   'varying vec2 textureCoordinates;',
    //
   'uniform sampler2D sampler1;',
   'uniform sampler2D sampler2;',
    //
   'void main() {',
        //
       'vec4 color = texture2D(sampler2, textureCoordinates);',
       //
       'gl_FragColor = (',
           'texture2D(sampler1, textureCoordinates) +',
           'vec4 (',
               '(1.0 - color.r) * 0.5,',
               '(1.0 - color.g) * 0.5,',
               '(1.0 - color.b) * 0.5,',
               '0',
           ')',
       ');',
   '}'

].join('\n');

Object.freeze(Multitexturing);
