//
// Constructor.
//
function TransformedPositionTextureCoordinates() {
    // No contents.
}

//
// Static constants.
//
TransformedPositionTextureCoordinates.VERTEX_SHADER_SOURCE = [
    //
    'precision highp float;', // which is the default vertex shader precision.

    'attribute vec4 vertexPosition;',
    'attribute vec2 vertexTextureCoordinates;',

    'varying vec2 _textureCoordinates;',

    'void main() {',
        //
        'gl_Position = vertexPosition;',

        '_textureCoordinates = vertexTextureCoordinates;',
    '}'

].join('\n');

TransformedPositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = [
    //
    'precision mediump float;', // which is the recommended fragment shader precision.

    'uniform sampler2D sampler;',

    'varying vec2 _textureCoordinates;',

    'void main() {',
        'gl_FragColor = texture2D(sampler, _textureCoordinates);',
    '}'
   
].join('\n');

export { TransformedPositionTextureCoordinates };
