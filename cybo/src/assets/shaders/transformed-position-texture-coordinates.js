//
// Constructor.
//
function TransformedPositionTextureCoordinates() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
TransformedPositionTextureCoordinates.VERTEX_SHADER_SOURCE = [
    //
   'attribute vec4 vertexPosition;',
   'attribute vec2 vertexTextureCoordinates;',
    //
   'varying highp vec2 textureCoordinates;',
    //
   'void main() {',
       'gl_Position = vertexPosition;',
       'textureCoordinates = vertexTextureCoordinates;',
   '}'

].join('\n');

TransformedPositionTextureCoordinates.FRAGMENT_SHADER_SOURCE = [
    //
   'varying highp vec2 textureCoordinates;',
   'uniform sampler2D sampler;',
    //
   'void main() {',
       'gl_FragColor = texture2D(sampler, textureCoordinates);',
   '}'
   
].join('\n');

Object.freeze(TransformedPositionTextureCoordinates);

export { TransformedPositionTextureCoordinates };
