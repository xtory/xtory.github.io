//
// Constructor.
//
function PositionColor() {
    // No contents.
}

//
// Static constants.
//
PositionColor.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +
    'attribute vec4 vertexColor;' +

    'uniform mat4 transform;' +

    'varying vec4 _color;' +

    'void main() {' +
        //
        'gl_Position = transform * vec4(vertexPosition, 1.0);' +
        
        '_color = vertexColor;' +
    '}'
);

PositionColor.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'varying vec4 _color;' +

    'void main() {' +
        'gl_FragColor = _color;' +
    '}'
);

export { PositionColor };
