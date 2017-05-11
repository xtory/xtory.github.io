//
// Constructor.
//
function TransformedPositionColorTextureCoordinates() {
    // No contents.
}

//
// Static constants.
//
TransformedPositionColorTextureCoordinates.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec4 vertexPosition;' +
    'attribute vec4 vertexColor;' +
    'attribute vec2 vertexTextureCoordinates;' +

    'varying vec4 _color;' +
    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        //
        'gl_Position = vertexPosition;' +
       
        '_color = vertexColor;' +
        '_textureCoordinates = vertexTextureCoordinates;' +
    '}'
);

TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'uniform sampler2D sampler;' +

    'varying vec4 _color;' +
    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        'gl_FragColor = _color * texture2D(sampler, _textureCoordinates);' +
    '}'
);

export { TransformedPositionColorTextureCoordinates };
