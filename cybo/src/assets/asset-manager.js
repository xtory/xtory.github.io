import { JSHelper }   from '../helpers/js-helper';
import { MathHelper } from '../math/helpers/math-helper';
import { ShaderType } from '../graphics/fx/shader-type';

//
// Constructor.
//
function AssetManager(_xcene) {
    //
    var _renderingContext =
        _xcene.graphicsManager.renderingContext;

    //
    // Properties.
    //
    Object.defineProperty(this, 'xcene', {
        get: function() { return _xcene; }
    });
    
    //
    // Privileged methods.
    //
    this.loadShader = function(shaderType, shaderSource) {
        //
        var shader;

        if (shaderType === ShaderType.VERTEX_SHADER) {
            //
            shader = _renderingContext.createShader (
                WebGLRenderingContext.VERTEX_SHADER
            );
        } else if (
            shaderType === ShaderType.FRAGMENT_SHADER
        ){
            shader = _renderingContext.createShader (
                WebGLRenderingContext.FRAGMENT_SHADER
            );
        } else {
            return null; // Unknown shader type
        }        

        // Send the source to the shader object
        _renderingContext.shaderSource(shader, shaderSource);

        // Compile the shader program
        _renderingContext.compileShader(shader);

        // See if it compiled successfully
        if (JSHelper.isUndefinedOrNull (
                _renderingContext.getShaderParameter (
                    shader,
                    WebGLRenderingContext.COMPILE_STATUS
                )
            ) === true)
        {
            throw (
                'An error occurred compiling the shaders: ' +
                _renderingContext.getShaderInfoLog(shader)
            );
        }

        return shader;
    };

    this.loadShaderFromHtmlElement = function(id) {
        //
        var shaderScript = document.getElementById(id);

        // Didn't find an element with the specified ID; abort.

        if (shaderScript === null) {
            return null;
        }

        // Walk through the source element's children, building the
        // shader source string.

        var shaderSource = '';
        var currentChild = shaderScript.firstChild;

        while (currentChild !== null) {
            //
            if (currentChild.nodeType === Node.TEXT_NODE) {
                shaderSource += currentChild.textContent;
            }

            currentChild = currentChild.nextSibling;
        }

        // Now figure out what type of shader script we have,
        // based on its MIME type.

        var shader;

        if (shaderScript.type === 'x-shader/x-vertex') {
            //
            shader = _renderingContext.createShader (
                WebGLRenderingContext.VERTEX_SHADER
            );
        } else if (
            shaderScript.type === 'x-shader/x-fragment'
        ){
            shader = _renderingContext.createShader (
                WebGLRenderingContext.FRAGMENT_SHADER
            );
        } else {
            return null; // Unknown shader type
        }

        // Send the source to the shader object
        _renderingContext.shaderSource(shader, shaderSource);

        // Compile the shader program
        _renderingContext.compileShader(shader);

        // See if it compiled successfully
        if (JSHelper.isUndefinedOrNull (
                _renderingContext.getShaderParameter (
                    shader,
                    WebGLRenderingContext.COMPILE_STATUS
                )
            ) === true)
        {
            throw (
                'An error occurred compiling the shaders: ' +
                _renderingContext.getShaderInfoLog(shader)
            );
        }

        return shader;
    };

    this.loadTexture2D = function(imageSourceUrl) {
        //
        var image = new Image();
        var texture = _renderingContext.createTexture();

        image.addEventListener('load', function() {
            handleTextureLoaded(image, texture);
        });

        image.src = imageSourceUrl;

        function handleTextureLoaded(image, texture) {
            //
            // Test:
            texture.width = image.width;
            texture.height = image.height;
            // :Test

            _renderingContext.bindTexture (
                WebGLRenderingContext.TEXTURE_2D,
                texture
            );

            _renderingContext.texImage2D (
                WebGLRenderingContext.TEXTURE_2D,    // target
                0,                                   // level
                WebGLRenderingContext.RGBA,          // internalFormat
                WebGLRenderingContext.RGBA,          // format
                WebGLRenderingContext.UNSIGNED_BYTE, // type
                image                                // htmlImageElement
            );

            if (MathHelper.isPowerOfTwo(image.width) === true &&
                MathHelper.isPowerOfTwo(image.height) === true) {
                //
                _renderingContext.generateMipmap (
                    WebGLRenderingContext.TEXTURE_2D
                );
                
                _renderingContext.texParameteri (
                    WebGLRenderingContext.TEXTURE_2D,
                    WebGLRenderingContext.TEXTURE_MIN_FILTER,
                    WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
                );

            } else {
                //
                _renderingContext.texParameteri (
                    WebGLRenderingContext.TEXTURE_2D,
                    WebGLRenderingContext.TEXTURE_MIN_FILTER,
                    WebGLRenderingContext.LINEAR
                );
            }

            // TEXTURE_MAG_FILTER only has NEAREST or LINEAR to choose, no
            // LINEAR_MIPMAP_LINEAR.
            _renderingContext.texParameteri (
                WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_MAG_FILTER,
                WebGLRenderingContext.LINEAR
            );

            _renderingContext.texParameteri (
                WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_WRAP_S,
                WebGLRenderingContext.CLAMP_TO_EDGE
            );

            _renderingContext.texParameteri (
                WebGLRenderingContext.TEXTURE_2D,
                WebGLRenderingContext.TEXTURE_WRAP_T,
                WebGLRenderingContext.CLAMP_TO_EDGE
            );

            _renderingContext.bindTexture (
                WebGLRenderingContext.TEXTURE_2D,
                null
            );
        }

        return texture;
    };
}

Object.freeze(AssetManager);

export { AssetManager };
