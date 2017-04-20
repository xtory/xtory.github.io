// Note:
// SpriteBatch only supports vertex buffers, no index buffers.

// Note:
// LineSegment2D/3D do support vertex/index buffers.

// Note:
// Sees the notes in the beginning of SpriteBatchStyle.

import { DepthBufferValues }     from './depth-buffer-values';
import { Sprite }                from './sprite';
import { SpriteBatchStyle }      from './sprite-batch-style';
import { SpriteCreationOptions } from './sprite-creation-options';
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
    var _defaultVertexBuffers;

    // Shaders.
    var _program;
    var _attributeLocations;
    var _uniformLocations;

    // Helpers
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
        console.log('g2l.SpriteBatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        'get': function() { return _renderer; }
    });

    Object.defineProperty(_self, 'isBegun', {
        'get': function() { return _isBegun; }
    });

    //
    // Private methods.
    //
    function setUpVertexBuffers() {
        //
        _vertexBuffers = {
            'position': [],
            'color': [],
            'textureCoordinates': []
        };

        _defaultVertexBuffers = {
            'color': _renderer.loader.createVertexBuffer(),
            'textureCoordinates': _renderer.loader.createVertexBuffer()
        };

        _defaultVertexBuffers.color.loadData (
            Sprite.DEFAULT_VERTEX_COLORS,
            Sprite.COLOR_SIZE
        );

        _defaultVertexBuffers.textureCoordinates.loadData (
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
            'vertexPosition': _renderer.getAttributeLocation (
                _program,
                'vertexPosition'
            ),

            'vertexColor': _renderer.getAttributeLocation (
                _program,
                'vertexColor'
            ),

            'vertexTextureCoordinates': _renderer.getAttributeLocation (
                _program,
                'vertexTextureCoordinates'
            )
        };

        _uniformLocations = {
            //
            'canvasClientSize': _renderer.getUniformLocation (
                _program,
                'canvasClientSize'
            ),

            'sampler': _renderer.getUniformLocation (
                _program,
                'sampler'
            )
        };
    }

    function flush() {
        //
        _renderer.program = _program;

        _renderer.setVector2DUniform (
            // Part 1.
            _uniformLocations.canvasClientSize,
            // Part 2.
            new Float32Array ([
                _renderer.canvas.clientWidth,
                _renderer.canvas.clientHeight            
            ])
        );        

        var vb = null;
        var lastTexture = null;
        
        for (var i=0; i<_db.length; i++) {
            //
            var item = _db[i];

            vb = _vertexBuffers.position[i];

            _renderer.setAttribute (
                _attributeLocations.vertexPosition,
                vb
            );

            if ((item.creationOptions & SpriteCreationOptions.VERTEX_COLORS) ===
                SpriteCreationOptions.VERTEX_COLORS) {
                //
                vb = _vertexBuffers.color[i];

            } else {
                vb = _defaultVertexBuffers.color;
            }

            _renderer.setAttribute (
                _attributeLocations.vertexColor,
                vb
            );

            if ((item.creationOptions & SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) ===
                SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) {
                //
                vb = _vertexBuffers.textureCoordinates[i];

            } else {
                vb = _defaultVertexBuffers.textureCoordinates;
            }

            _renderer.setAttribute (
                _attributeLocations.vertexTextureCoordinates,
                vb
            );

            if (lastTexture !== item.texture) {
                //
                _renderer.setSampler (
                    _uniformLocations.sampler,
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
    };

    this.drawSprite = function (
        texture,
        creationOptions,
        centerScreenPosition,
        screenSize,
        vertexColor,
        sourceTextureCoordinateRect
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

        var sprite = new Sprite (
            _self,
            texture,
            creationOptions,
            centerScreenPosition,
            screenSize,
            vertexColor,
            sourceTextureCoordinateRect
        );

        var vb;
        var index = _db.length;
        
        // 1. Vertex positions.
        if (_vertexBuffers.position.length - 1 < index) {
            //
            vb = _renderer.loader.createVertexBuffer();
            _vertexBuffers.position.push(vb);

        } else {
            //
            vb = _vertexBuffers.position[index];
        }

        vb.loadData (
            sprite.vertexPositions,
            Sprite.POSITION_SIZE
        );

        // 2. Vertex colors.
        if (_vertexBuffers.color.length - 1 < index) {
            //
            vb = _renderer.loader.createVertexBuffer();
            _vertexBuffers.color.push(vb);

        } else {
            //
            vb = _vertexBuffers.color[index];
        }

        if ((sprite.creationOptions & SpriteCreationOptions.VERTEX_COLORS) ===
            SpriteCreationOptions.VERTEX_COLORS) {
            //
            vb.loadData (
                sprite.vertexColors,
                Sprite.COLOR_SIZE
            );
        }

        // 3. Vertex texture coordinates.
        if (_vertexBuffers.textureCoordinates.length - 1 < index) {
            //
            vb = _renderer.loader.createVertexBuffer();
            _vertexBuffers.textureCoordinates.push(vb);

        } else {
            //
            vb = _vertexBuffers.textureCoordinates[index];
        }

        if ((sprite.creationOptions & SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) ===
            SpriteCreationOptions.VERTEX_TEXTURE_COORDINATES) {
            //
            vb.loadData (
                sprite.vertexTextureCoordinates,
                Sprite.TEXTURE_COORDINATE_SIZE
            );
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
// Static constants (after Object.freeze()).
//
SpriteBatch.VERTEX_SHADER_SOURCE = [
    //
   'precision highp float;', // which is the default vertex shader precision.

   'attribute vec3 vertexPosition;',
   'attribute vec4 vertexColor;',
   'attribute vec2 vertexTextureCoordinates;',

   'varying vec4 color;',
   'varying vec2 textureCoordinates;',

   'uniform vec2 canvasClientSize;',

   'void main() {',
        //
        // Converts the vertex position from screen to clip space (not NDC yet).
       'gl_Position = vec4 (',
           '-1.0 + 2.0 * (vertexPosition.x / canvasClientSize.x),',
           '-1.0 + 2.0 * (vertexPosition.y / canvasClientSize.y),',
           'vertexPosition.z,',
           '1.0',
       ');',

       'color = vertexColor;',
       'textureCoordinates = vertexTextureCoordinates;',
   '}'

].join('\n');

SpriteBatch.FRAGMENT_SHADER_SOURCE = [
    //
   'precision mediump float;', // which is the recommended fragment shader precision.

   'varying vec4 color;',
   'varying vec2 textureCoordinates;',

   'uniform sampler2D sampler;',

   'void main() {',
       'gl_FragColor = color * texture2D(sampler, textureCoordinates);',
   '}'
   
].join('\n');

Object.freeze(SpriteBatch);

export { SpriteBatch };
