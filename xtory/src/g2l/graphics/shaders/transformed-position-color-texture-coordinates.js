//
// Constructor.
//
function TransformedPositionColorTextureCoordinates() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE = [
    //
    'precision highp float;', // which is the default vertex shader precision.

    'attribute vec4 vertexPosition;',
    'attribute vec4 vertexColor;',
    'attribute vec2 vertexTextureCoordinates;',

    'varying vec4 _color;',
    'varying vec2 _textureCoordinates;',

    'void main() {',
        //
        'gl_Position = vertexPosition;',
       
        '_color = vertexColor;',
        '_textureCoordinates = vertexTextureCoordinates;',
    '}'

].join('\n');

TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE = [
    //
    'precision mediump float;', // which is the recommended fragment shader precision.

    'uniform sampler2D sampler;',

    'varying vec4 _color;',
    'varying vec2 _textureCoordinates;',

    'void main() {',
        'gl_FragColor = _color * texture2D(sampler, _textureCoordinates);',
    '}'
   
].join('\n');

Object.freeze(TransformedPositionColorTextureCoordinates);

export { TransformedPositionColorTextureCoordinates };
