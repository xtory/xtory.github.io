//
// Constructor.
//
function PhongShading() {
    // No contents.
}

//
// Static constants.
//
PhongShading.VERTEX_SHADER_SOURCE = [
    //
    'precision highp float;', // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;',
    'attribute vec3 vertexNormal;',
    'attribute vec2 vertexTextureCoordinates;',

    'uniform mat4 transposeOfInverseOfModelMatrix;',
    'uniform mat4 transform;',

    'varying vec2 _textureCoordinates;',
    'varying vec3 _lighting;',

    'void main() {',
        //
        'gl_Position = transform * vec4(vertexPosition, 1.0);',
        
        '_textureCoordinates = vertexTextureCoordinates;',

        // Applies lighting effect.
        'vec3 ambientLight = vec3(0.25, 0.25, 0.25);',
        'vec3 directionalLightColor = vec3(1, 1, 1);',
        'vec3 directionalVector = vec3(1, 1, 1);',

        'vec4 transformedNormal = (',
            'transposeOfInverseOfModelMatrix *',
            'vec4(vertexNormal, 1.0)',
        ');',

        'float directional = max (',
            'dot(transformedNormal.xyz, directionalVector),',
            '0.0',
        ');',

        '_lighting = (',
            'ambientLight +',
            '(directionalLightColor * directional)',
        ');',
    '}'

].join('\n');

PhongShading.FRAGMENT_SHADER_SOURCE = [
    //
    'precision mediump float;', // which is the recommended fragment shader precision.

    'uniform sampler2D sampler;',

    'varying vec2 _textureCoordinates;',
    'varying vec3 _lighting;',

    'void main() {',
        //
        'vec4 texelColor =',
            'texture2D(sampler, _textureCoordinates);',

        'gl_FragColor =',
            'vec4(texelColor.rgb * _lighting, texelColor.a);',
    '}'

].join('\n');
