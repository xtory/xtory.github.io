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

    'uniform mat4 transform;',

    'attribute vec3 vertexPosition;',
    'attribute vec2 vertexTextureCoordinates;',

    'varying vec2 _textureCoordinates;',

    'void main() {',
        //
        'gl_Position = transform * vec4(vertexPosition, 1.0);',

        '_textureCoordinates = vertexTextureCoordinates;',
    '}'

].join('\n');

Multitexturing.FRAGMENT_SHADER_SOURCE = [
    //
    'precision mediump float;', // which is the recommended fragment shader precision.

    'uniform sampler2D sampler1;',
    'uniform sampler2D sampler2;',

    'varying vec2 _textureCoordinates;',

    'void main() {',
        //
        'vec4 color = texture2D(sampler2, _textureCoordinates);',

        'gl_FragColor = (',
            'texture2D(sampler1, _textureCoordinates) +',
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
