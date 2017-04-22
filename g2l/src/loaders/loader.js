import { BufferLoader }  from './buffer-loader';
import { MathHelper }    from '../math/helpers/math-helper';
import { ProgramLoader } from './program-loader';
import { TextureLoader } from './texture-loader';

//
// Constructor.
//
function Loader(_renderer) {
    //
    var _self;
    var _gl;
    var _bufferLoader;
    var _textureLoader;
    var _programLoader;

    try {
        //
        _self = this;
        
        bindRenderer();

        _bufferLoader = new BufferLoader(_self);
        _textureLoader = new TextureLoader(_self);
        _programLoader = new ProgramLoader(_self);

    } catch (e) {
        //
        console.log('g2l.Loader: ' + e);

        throw e;
    }

    //
    // Private methods.
    //
    function bindRenderer() {
        //
        _gl = _renderer.gl;

        Object.defineProperty(_self, 'renderer', {
            get: function() { return _renderer; }
        })
    }
    
    //
    // Privileged methods.
    //
    this.createVertexBuffer = function() {
        return _bufferLoader.createVertexBuffer();
    };

    this.createIndexBuffer = function() {
        return _bufferLoader.createIndexBuffer();
    };

    this.setUpProgram = function(vertexShaderSource, fragmentShaderSource) {
        //
        return _programLoader.setUpProgram(vertexShaderSource, fragmentShaderSource);
    };

    this.setUpProgramFromHtmlElements = function(vertexShaderId, fragmentShaderId) {
        //
        return _programLoader.setUpProgram(vertexShaderId, fragmentShaderId);
    };

    this.loadTexture2D = function(url) {
        //
        return _textureLoader.loadTexture2D(url);
    };
}

Object.freeze(Loader);

export { Loader };
