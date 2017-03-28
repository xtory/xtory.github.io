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
   'attribute vec4 vertexPosition;',
   'attribute vec4 vertexColor;',
   'attribute vec2 vertexTextureCoordinates;',
    //
   'varying highp vec4 color;',
   'varying highp vec2 textureCoordinates;',
    //
   'void main() {',
        //
       'gl_Position = vertexPosition;',
        //
       'color = vertexColor;',
       'textureCoordinates = vertexTextureCoordinates;',
   '}'

].join('\n');

TransformedPositionColorTextureCoordinates.FRAGMENT_SHADER_SOURCE = [
    //
   'varying highp vec4 color;',
   'varying highp vec2 textureCoordinates;',
    //
   'uniform sampler2D sampler;',
    //
   'void main() {',
       'gl_FragColor = color * texture2D(sampler, textureCoordinates);',
   '}'
   
].join('\n');

Object.freeze(TransformedPositionColorTextureCoordinates);

export { TransformedPositionColorTextureCoordinates };
