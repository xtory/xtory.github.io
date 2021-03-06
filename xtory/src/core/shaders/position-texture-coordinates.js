//
// Constructor.
//
function PositionTextureCoordinates() {
    // No contents.
}

//
// Static constants.
//
PositionTextureCoordinates.VERTEX_SHADER_SOURCE = (
    //
    'precision highp float;' + // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;' +
    'attribute vec2 vertexTextureCoordinates;' +

    'uniform mat4 transform;' +

    'varying vec2 _textureCoordinates;' +

    'void main() {' +
        //
        'gl_Position = transform * vec4(vertexPosition, 1.0);' +

        '_textureCoordinates = vertexTextureCoordinates;' +
    '}'
);

PositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = (
    //
   'precision mediump float;' + // which is the recommended fragment shader precision.

   'uniform sampler2D sampler;' +

   'varying vec2 _textureCoordinates;' +

   'void main() {' +
       'gl_FragColor = texture2D(sampler, _textureCoordinates);' +
   '}'
);

export { PositionTextureCoordinates };
