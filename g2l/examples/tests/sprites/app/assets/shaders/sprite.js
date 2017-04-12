//
// Constructor.
//
function Sprite() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
Sprite.VERTEX_SHADER_SOURCE = [
    //
   'precision highp float;', // which is the default vertex shader precision.

   'attribute vec3 vertexScreenPosition;',
   'attribute vec4 vertexColor;',
   'attribute vec2 vertexTextureCoordinates;',

   'varying vec4 color;',
   'varying vec2 textureCoordinates;',

   'uniform vec2 canvasClientSize;',

   'void main() {',
        //
        // Converts the vertex position from screen space to clip space (not NDC
        // yet).
       'gl_Position = vec4 (',
           '-1.0 + 2.0 * (vertexScreenPosition.x / canvasClientSize.x),',
           '-1.0 + 2.0 * (vertexScreenPosition.y / canvasClientSize.y),',
           'vertexScreenPosition.z,',
           '1.0',
       ');',

       'color = vertexColor;',
       'textureCoordinates = vertexTextureCoordinates;',
   '}'

].join('\n');

Sprite.FRAGMENT_SHADER_SOURCE = [
    //
   'precision mediump float;', // which is the recommended fragment shader precision.

   'varying vec4 color;',
   'varying vec2 textureCoordinates;',

   'uniform sampler2D sampler;',

   'void main() {',
       'gl_FragColor = color * texture2D(sampler, textureCoordinates);',
   '}'
   
].join('\n');

Object.freeze(Sprite);
