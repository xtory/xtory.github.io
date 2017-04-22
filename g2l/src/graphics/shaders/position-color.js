//
// Constructor.
//
function PositionColor() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
PositionColor.VERTEX_SHADER_SOURCE = [
    //
    'precision highp float;', // which is the default vertex shader precision.

    'uniform mat4 transform;',

    'attribute vec3 vertexPosition;',
    'attribute vec4 vertexColor;',

    'varying vec4 _color;',

    'void main() {',
        //
        'gl_Position = transform * vec4(vertexPosition, 1.0);',
        
        '_color = vertexColor;',
    '}'

].join('\n');

PositionColor.FRAGMENT_SHADER_SOURCE = [
    //
    'precision mediump float;', // which is the recommended fragment shader precision.

    'varying vec4 _color;',

    'void main() {',
        'gl_FragColor = _color;',
    '}'

].join('\n');

Object.freeze(PositionColor);

export { PositionColor };
