import { Program }    from '../graphics/shaders/program';
import { ShaderType } from '../graphics/shaders/shader-type';

//
// Constructor.
//
function ProgramLoader(_loader) {
    //
    var _self;
    var _gl;

    try {
        //
        _self = this;
        _gl = _loader.renderer.gl;

    } catch (e) {
        //
        console.log('g2l.ProgramLoader: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    })

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
        var program = new Program(_self);
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
}

export { ProgramLoader };
