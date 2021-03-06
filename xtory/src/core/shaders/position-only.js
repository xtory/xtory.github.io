//
// Constructor.
//
function PositionOnly() {
    // No contents.
}

//
// Static constants.
//
PositionOnly.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +

    'uniform mat4 transform;' +

    'void main() {' +
        'gl_Position = transform * vec4(vertexPosition, 1.0);' +
    '}'
);

PositionOnly.FRAGMENT_SHADER_SOURCE = (
    //
    'precision mediump float;' + // which is the recommended fragment shader precision.

    'void main() {' +
        'gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);' +
    '}'
);

export { PositionOnly };
