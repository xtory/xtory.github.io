// Note:
// SpriteBatch only supports vertex buffers, no index buffers.

// Note:
// LineSegment2D/3D do support vertex/index buffers.

// Note:
// Sees the notes in the beginning of SpriteBatchStyle.

import { Color }                 from './color';
import { DepthBufferValues }     from './depth-buffer-values';
import { Sprite }                from './sprite';
import { SpriteBatchStyle }      from './sprite-batch-style';
import { SpriteFlushingOptions } from './sprite-flushing-options';
import { PrimitiveType }         from './primitive-type';

//
// Constructor.
//
function SpriteBatch(_renderer, _style) {
    //
    var _self;
    var _gl;
    var _db;
    
    var _vertexBuffers;
    var _defaultTextureCoordinateVertexBuffer;
    var _vertexArrays;

    // Shaders.
    var _program;
    var _attributeLocations;
    var _uniformLocations;

    // Helpers
    var _canvasClientSize; // which is a Float32Array.
    var _isBegun;
    var _isOkToAddItem;

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new SpriteBatchStyle();
        }

        _gl = _renderer.gl;

        _db = [];

        setUpVertexBuffers();

        setUpShaders();

        // Helpers.
        _isBegun = false;
        _isOkToAddItem = true;

    } catch (e) {
        //
        console.log('xtory.core.SpriteBatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        get: function() { return _renderer; }
    });

    Object.defineProperty(_self, 'isBegun', {
        get: function() { return _isBegun; }
    });

    //
    // Private methods.
    //
    function setUpVertexBuffers() {
        //
        _vertexBuffers = {
            position: [],
            textureCoordinates: []
        };

        _defaultTextureCoordinateVertexBuffer =
            _renderer.loader.createVertexBuffer();

        // Test:
        _vertexArrays = {
            position: [],
            textureCoordinates: []
        };
        // :Test

        _defaultTextureCoordinateVertexBuffer.loadData (
            Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES,
            Sprite.TEXTURE_COORDINATE_SIZE
        );
    }

    function setUpShaders() {
        //
        _program = _renderer.loader.setUpProgram (
            SpriteBatch.VERTEX_SHADER_SOURCE,
            SpriteBatch.FRAGMENT_SHADER_SOURCE
        );

        _attributeLocations = {
            //
            vertexPosition: _renderer.getAttributeLocation (
                _program,
                'vertexPosition'
            ),

            vertexTextureCoordinates: _renderer.getAttributeLocation (
                _program,
                'vertexTextureCoordinates'
            )
        };

        _uniformLocations = {
            //
            shared: {
                //
                canvasClientSize: _renderer.getUniformLocation (
                    _program,
                    'canvasClientSize'
                )
            },

            unique: {
                //
                color: _renderer.getUniformLocation (
                    _program,
                    'color'
                ),

                sampler: _renderer.getUniformLocation (
                    _program,
                    'sampler'
                )
            }
        };

        // Helpers.
        _canvasClientSize = new Float32Array([undefined, undefined]);
    }
    
    function flush() {
        //
        _renderer.program = _program;

        if (_renderer.canvas.clientWidth !== _canvasClientSize[0] ||
            _renderer.canvas.clientHeight !== _canvasClientSize[1]) {
            //
            _canvasClientSize[0] = _renderer.canvas.clientWidth;
            _canvasClientSize[1] = _renderer.canvas.clientHeight;

            _renderer.setVector2DUniform (
                _uniformLocations.shared.canvasClientSize,
                _canvasClientSize
            );
        }

        var vb = null;
        var lastColor; // which is a Float32Array.
        var lastOfIfUsesDefault; // if texture coordinates uses default.
        var lastTexture;
        
        for (var i=0; i<_db.length; i++) {
            //
            var item = _db[i];

            vb = _vertexBuffers.position[i];

            _renderer.setAttribute (
                _attributeLocations.vertexPosition,
                vb
            );

            var usesDefault = (
                ((item.flushingOptions & SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) ===
                SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) ?
                false :
                true
            );

            if (usesDefault === false) {
                //
                vb = _vertexBuffers.textureCoordinates[i];

            } else {
                //
                vb = _defaultTextureCoordinateVertexBuffer;
            }

            if (// Part 1.
                lastColor === undefined ||
                // Part 2.
               (item.color[0] != lastColor[0] ||
                item.color[1] != lastColor[1] ||
                item.color[2] != lastColor[2] ||
                item.color[3] != lastColor[3])) {
                //
                _renderer.setVector4DUniform (
                    // Part 1.
                    _uniformLocations.unique.color,
                    // Part 2.
                    item.color
                );

                lastColor = item.color;
            }
            
            if (usesDefault !== lastOfIfUsesDefault) {
                //
                _renderer.setAttribute (
                    _attributeLocations.vertexTextureCoordinates,
                    vb
                );

                lastOfIfUsesDefault = usesDefault;
            }

            if (lastTexture !== item.texture) {
                //
                _renderer.setSampler (
                    _uniformLocations.unique.sampler,
                    item.texture
                );

                lastTexture = item.texture;
            }

            _renderer.drawPrimitives (
                PrimitiveType.TRIANGLE_STRIP,
                0,
                4
            );
        }
    }    

    function clear() {
        //
        _db = [];

        if (_style.clearsDbAfterDrawing === false) {
            _isOkToAddItem = true;
        }
    }

    //
    // Privileged methods.
    //
    this.begin = function() {
        //
        _isBegun = true;

        if (_vertexArrays.position.length != _vertexBuffers.position.length ||
            _vertexArrays.textureCoordinates.length != _vertexBuffers.textureCoordinates.length) {
            //
            throw 'An invalid-length exception raised.';
        }
    };

    this.drawSprite = function (
        texture,
        flushingOptions,
        centerScreenPosition,
        screenSize,
        sourceRect,
        color
    ){
        if (_style.clearsDbAfterDrawing === false &&
            _isOkToAddItem === false) {
            return;
        }

        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        if (DepthBufferValues.isDepthOutOfRange(centerScreenPosition.z) === true) {
            return;
        }

        var va1, va2; // vertex arrays.
        var vb1, vb2; // vertex buffers.
        var index = _db.length;

        // 1. Vertex arrays.
        if (_vertexArrays.position.length - 1 < index) {
            //
            va1 = new Float32Array(Sprite.POSITION_SIZE * Sprite.VERTEX_COUNT);
            _vertexArrays.position.push(va1);

            vb1 = _renderer.loader.createVertexBuffer();
            _vertexBuffers.position.push(vb1);

        } else { // index <=  _vertexArrays.position.length - 1
            //
            va1 = _vertexArrays.position[index];
            vb1 = _vertexBuffers.position[index];
        }

        // 2. Vertex texture coordinates.
        if (_vertexArrays.textureCoordinates.length - 1 < index) {
            //
            va2 = new Float32Array(Sprite.TEXTURE_COORDINATE_SIZE * Sprite.VERTEX_COUNT);
            _vertexArrays.textureCoordinates.push(va2);

            vb2 = _renderer.loader.createVertexBuffer();
            _vertexBuffers.textureCoordinates.push(vb2);

        } else { // index <= _vertexArrays.textureCoordinates.length - 1
            //
            va2 = _vertexArrays.textureCoordinates[index];
            vb2 = _vertexBuffers.textureCoordinates[index];
        }

        var sprite = new Sprite (
            // Part 1.
            _self,
            // Part 2.
            texture,
            // Part 3.
            centerScreenPosition, screenSize,
            // Part 4.
            sourceRect,
            // Part 5.
            color,
            // Part 6.
            va1, va2
        );

        // 1. Vertex positions.
        vb1.loadData(va1, Sprite.POSITION_SIZE);

        // 2. Vertex texture coordinates.
        if ((sprite.flushingOptions & SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) ===
            SpriteFlushingOptions.VERTEX_TEXTURE_COORDINATES) {
            //
            vb2.loadData(va2, Sprite.TEXTURE_COORDINATE_SIZE);
        }

        _db.push(sprite);
    };

    this.end = function() {
        //
        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        if (0 < _db.length) {
            //
            if (// Part 1.
                _style.clearsDbAfterDrawing === true || 
                // Part 2.
               (_style.clearsDbAfterDrawing === false &&
                _isOkToAddItem === true)) {
                //
                if (_style.clearsDbAfterDrawing === false) {
                    _isOkToAddItem = false;
                }
            }

            // Flushes the deferred items.
            flush();

            if (_style.clearsDbAfterDrawing === true) {
                //
                // Clears the deferred items.
                clear();
            }
        }

        _isBegun = false;
    };
}

//
// Static constants.
//
SpriteBatch.VERTEX_SHADER_SOURCE = [
    //
    'precision highp float;', // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;',
    'attribute vec2 vertexTextureCoordinates;',

    'uniform vec2 canvasClientSize;',

    'varying vec2 _textureCoordinates;',

    'void main() {',
        //
        // Converts the (vertex) position from screen to 'clip' space with w = 1,
        // just like what ScreenCoordinateHelper.toClipSpace() does.
        'gl_Position = vec4 (',
            '-1.0 + 2.0 * (vertexPosition.xy / canvasClientSize.xy),',
            'vertexPosition.z,',
            '1.0',
        ');',

        '_textureCoordinates = vertexTextureCoordinates;',
    '}'

].join('\n');

SpriteBatch.FRAGMENT_SHADER_SOURCE = [
    //
    'precision mediump float;', // which is the recommended fragment shader precision.

    'uniform vec4 color;',
    'uniform sampler2D sampler;',

    'varying vec2 _textureCoordinates;',

    'void main() {',
        'gl_FragColor = color * texture2D(sampler, _textureCoordinates);',
    '}'
   
].join('\n');

export { SpriteBatch };
