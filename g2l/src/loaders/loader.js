import { IndexBuffer }  from '../graphics/index-buffer';
import { MathHelper }   from '../math/helpers/math-helper';
import { Program }      from '../graphics/shaders/program';
import { ShaderType }   from '../graphics/shaders/shader-type';
import { Texture2D }    from '../graphics/2d-texture';
import { VertexBuffer } from '../graphics/vertex-buffer';

//
// Constructor.
//
function Loader(_scene) {
    //
    var _gl = _scene.renderer.webGLContext;

    //
    // Properties.
    //
    Object.defineProperty(this, 'scene', {
        get: function() { return _scene; }
    });

    //
    // Private methods.
    //
    function loadWebGLShader(shaderType, shaderSource) {
        //
        var webGLShader;

        if (shaderType === ShaderType.VERTEX_SHADER) {
            webGLShader = _gl.createShader(_gl.VERTEX_SHADER);
        } else if (
            shaderType === ShaderType.FRAGMENT_SHADER
        ){
            webGLShader = _gl.createShader(_gl.FRAGMENT_SHADER);
        } else {
            return null; // Unknown shader type.
        }        

        // Send the source to the shader object
        _gl.shaderSource(webGLShader, shaderSource);

        // Compile the shader program
        _gl.compileShader(webGLShader);

        // See if it compiled successfully
        if (_gl.getShaderParameter(webGLShader, _gl.COMPILE_STATUS) === false) {
            //
            var log = _gl.getShaderInfoLog(webGLShader);
            _gl.deleteShader(webGLShader);

            throw 'An error occurred compiling the shaders: ' + log;
        }

        return webGLShader;
    }

    function loadWebGLShaderFromHtmlElement(id) {
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

        var webGLShader;

        if (shaderScript.type === 'x-shader/x-vertex') {
            webGLShader = _gl.createShader(_gl.VERTEX_SHADER);
        } else if (
            shaderScript.type === 'x-shader/x-fragment'
        ){
            webGLShader = _gl.createShader(_gl.FRAGMENT_SHADER);
        } else {
            return null; // Unknown shader type.
        }

        // Send the source to the shader object
        _gl.shaderSource(webGLShader, shaderSource);

        // Compile the shader program
        _gl.compileShader(webGLShader);

        // See if it compiled successfully
        if (_gl.getShaderParameter(webGLShader, _gl.COMPILE_STATUS) === false) {
            //
            var log = _gl.getShaderInfoLog(webGLShader);
            _gl.deleteShader(webGLShader);

            throw 'An error occurred compiling the shaders: ' + log;
        }

        return webGLShader;
    }

    function setUpProgram(webGLVertexShader, webGLFragmentShader) {
        //
        var program = new Program(_gl);
        var webGLProgram = program.webGLProgram;

        _gl.attachShader(webGLProgram, webGLVertexShader);
        _gl.attachShader(webGLProgram, webGLFragmentShader);

        _gl.linkProgram(webGLProgram);

        if (_gl.getProgramParameter(webGLProgram, _gl.LINK_STATUS) === false) {
            //
            var log = _gl.getProgramInfoLog(webGLProgram);
            _gl.deleteProgram(webGLProgram);

            throw 'Unable to initialize the (shader) program: ' + log;
        }
        
        return program;
    }
    
    //
    // Privileged methods.
    //
    this.createVertexBuffer = function() {
        return new VertexBuffer(_gl);
    };

    this.createIndexBuffer = function() {
        return new IndexBuffer(_gl);
    };

    this.setUpProgram = function(vertexShaderSource, fragmentShaderSource) {
        //
        var webGLVertexShader =
            loadWebGLShader(ShaderType.VERTEX_SHADER, vertexShaderSource);

        var webGLFragmentShader =
            loadWebGLShader(ShaderType.FRAGMENT_SHADER, fragmentShaderSource);

        return setUpProgram(webGLVertexShader, webGLFragmentShader);
    };

    this.setUpProgramFromHtmlElements = function(vertexShaderId, fragmentShaderId) {
        //
        var vertexShader =
            loadWebGLShaderFromHtmlElement(ShaderType.VERTEX_SHADER, vertexShaderId);

        var fragmentShader =
            loadWebGLShaderFromHtmlElement(ShaderType.FRAGMENT_SHADER, fragmentShaderId);

        return setUpProgram(vertexShader, fragmentShader);
    };

    this.loadTexture2D = function(imageSourceUrl) {
        //
        var image = new Image();
        var texture = new Texture2D(_gl);

        image.addEventListener('load', function() {
            handleTextureLoaded(image, texture);
        });

        image.src = imageSourceUrl;

        function handleTextureLoaded(image, texture) {
            //
            _gl.bindTexture (
                _gl.TEXTURE_2D,
                texture.webGLTexture
            );

            _gl.texImage2D (
                _gl.TEXTURE_2D,    // target
                0,                 // level
                _gl.RGBA,          // internalFormat
                _gl.RGBA,          // format
                _gl.UNSIGNED_BYTE, // type
                image              // htmlImageElement
            );

            if (MathHelper.isPowerOfTwo(image.width) === true &&
                MathHelper.isPowerOfTwo(image.height) === true) {
                //
                _gl.generateMipmap(_gl.TEXTURE_2D);
                
                _gl.texParameteri (
                    _gl.TEXTURE_2D,
                    _gl.TEXTURE_MIN_FILTER,
                    _gl.LINEAR_MIPMAP_LINEAR
                );

            } else {
                //
                _gl.texParameteri (
                    _gl.TEXTURE_2D,
                    _gl.TEXTURE_MIN_FILTER,
                    _gl.LINEAR
                );
            }

            // TEXTURE_MAG_FILTER only has NEAREST or LINEAR to choose, no
            // LINEAR_MIPMAP_LINEAR.
            _gl.texParameteri (
                _gl.TEXTURE_2D,
                _gl.TEXTURE_MAG_FILTER,
                _gl.LINEAR
            );

            _gl.texParameteri (
                _gl.TEXTURE_2D,
                _gl.TEXTURE_WRAP_S,
                _gl.CLAMP_TO_EDGE
            );

            _gl.texParameteri (
                _gl.TEXTURE_2D,
                _gl.TEXTURE_WRAP_T,
                _gl.CLAMP_TO_EDGE
            );

            _gl.bindTexture(_gl.TEXTURE_2D, null);

            texture.width = image.width;
            texture.height = image.height;
        }

        return texture;
    };
}

Object.freeze(Loader);

export { Loader };
