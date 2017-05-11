//
// Constructor.
//
function TransformedPositionColor() {
    // No contents.
}

//
// Static constants.
//
TransformedPositionColor.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec4 vertexPosition;' +
    'attribute vec4 vertexColor;' +

    'varying vec4 _color;' +

    'void main() {' +
        //
        'gl_Position = vertexPosition;' +

        '_color = vertexColor;' +
    '}'
);

TransformedPositionColor.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'varying vec4 _color;' +

    'void main() {' +
        'gl_FragColor = _color;' +
    '}'
);

export { TransformedPositionColor };
