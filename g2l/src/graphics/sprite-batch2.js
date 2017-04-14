// Note:
// SpriteBatch, in this engine, only supports vertex buffers, no index buffers.

// Note:
// LineSegment2D/3D do support vertex/index buffers depends on what value areDb-
// FrequentlyChanged is in the constructors.

// Note:
// XNA SpriteBatch uses vertex/index buffers, and besides, it can draw more than
// one deferred item at once if those items use the same texture. Maybe someday
// I'll implement this feature, so this engine keeps areDbFrequentlyChanged in the
// constructor (but not uses it).

import { DepthBufferValues }     from './depth-buffer-values';
import { Sprite2 }               from './sprite2';
import { SpriteCreationOptions } from './sprite-creation-options';
import { PrimitiveType }         from './primitive-type';

//
// Constructor.
//
function SpriteBatch2(_renderer, _settings) {
    //
    var _self;
    var _gl;
    var _db;
    var _isBegun;
    var _isOkToAddItem;

    var _program;
    var _attributeLocations;
    var _uniformLocations;

    var _textures;
    var _spriteCounts;
    var _vertexBuffers;
    var _indexBuffers;
    var _clearsDbAfterDrawing;
    var _areDbFrequentlyChanged;

    var _defaultVertexBuffers;
    var _defaultIndexBuffer;
    
    var _vertexPositions;
    var _vertexColors;
    var _vertexTextureCoordinates;
    var _indices;

    var _lastTexture;
    var _index;

    try {
        //
        _self = this;
        _gl = _renderer.gl;

        if (_settings !== undefined) {
            _clearsDbAfterDrawing = _settings.clearsDbAfterDrawing;
            _areDbFrequentlyChanged = _settings.areDbFrequentlyChanged;
        }

        if (_clearsDbAfterDrawing === undefined) {
            _clearsDbAfterDrawing = SpriteBatch2.DEFAULT_OF_IF_CLEARS_DB_AFTER_DRAWING;
        }

        if (_areDbFrequentlyChanged === undefined) {
            _areDbFrequentlyChanged = SpriteBatch2.DEFAULT_OF_IF_DB_FREQUENTLY_CHANGED;
        }

        _db = [];

        setUpBuffers();

        setUpShaders();

        _isBegun = false;
        _isOkToAddItem = true;

    } catch (e) {
        //
        console.log('g2l.SpriteBatch2: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        'get': function() { return _renderer; }
    });

    //
    // Private methods.
    //
    function setUpBuffers() {
        //
        _textures = [];
        _spriteCounts = [];

        _vertexBuffers = {
            position: [],
            color: [],
            textureCoordinates: []
        };

        _indexBuffers = [];

        _defaultVertexBuffers = {
            color: _renderer.loader.createVertexBuffer(),
            textureCoordinates: _renderer.loader.createVertexBuffer()
        };

        _defaultVertexBuffers.color.loadData (
            Sprite2.DEFAULT_VERTEX_COLORS,
            Sprite2.COLOR_SIZE
        );

        _defaultVertexBuffers.textureCoordinates.loadData (
            Sprite2.DEFAULT_VERTEX_TEXTURE_COORDINATES,
            Sprite2.TEXTURE_COORDINATE_SIZE
        );

        _defaultIndexBuffer = _renderer.loader.createIndexBuffer();
        _defaultIndexBuffer.loadData(Sprite2.DEFAULT_INDICES);

        _vertexPositions = [];
        _vertexColors = [];
        _vertexTextureCoordinates = [];
        _indices = [];
    }

    function setUpShaders() {
        //
        _program = _renderer.loader.setUpProgram (
            SpriteBatch2.VERTEX_SHADER_SOURCE,
            SpriteBatch2.FRAGMENT_SHADER_SOURCE
        );

        _attributeLocations = {
            //
            vertexPosition: _renderer.getAttributeLocation (
                _program,
               'vertexPosition'
            ),

            vertexColor: _renderer.getAttributeLocation (
                _program,
               'vertexColor'
            ),

            vertexTextureCoordinates: _renderer.getAttributeLocation (
                _program,
               'vertexTextureCoordinates'
            )
        };

        _uniformLocations = {
            //
            canvasClientSize: _renderer.getUniformLocation (
                _program,
               'canvasClientSize'
            ),

            sampler: _renderer.getUniformLocation (
                _program,
               'sampler'
            )
        };
    }

    function test() {
        //
        var vb, ib;

        // Textures.
        _textures.push(_lastTexture);
        _index = _textures.length - 1;

        // Sprite2 counts.
        var spriteCount = (
            _vertexPositions.length /
            (Sprite2.POSITION_SIZE * Sprite2.VERTEX_COUNT) // = 3 * 4
        );

        _spriteCounts.push(spriteCount);

        // 1. Vertex positions.
        if (_vertexBuffers.position.length - 1 < _index) {
            //
            vb = _renderer.loader.createVertexBuffer();
            _vertexBuffers.position.push(vb);

        } else {
            vb = _vertexBuffers.position[_index];
        }

        vb.loadData (
            new Float32Array(_vertexPositions),
            Sprite2.POSITION_SIZE
        );

        // 2. Vertex colors.
        if (_vertexBuffers.color.length - 1 < _index) {
            //
            vb = _renderer.loader.createVertexBuffer();
            _vertexBuffers.color.push(vb);
            
        } else {
            vb = _vertexBuffers.color[_index];
        }

        vb.loadData (
            new Float32Array(_vertexColors),
            Sprite2.COLOR_SIZE
        );           

        // 3. Vertex texture coordinates.
        if (_vertexBuffers.textureCoordinates.length - 1 < _index) {
            //
            vb = _renderer.loader.createVertexBuffer();
            _vertexBuffers.textureCoordinates.push(vb);

        } else {
            vb = _vertexBuffers.textureCoordinates[_index];
        }

        vb.loadData (
            new Float32Array(_vertexTextureCoordinates),
            Sprite2.TEXTURE_COORDINATE_SIZE
        );

        // 4. Indices.
        if (_indexBuffers.length - 1 < _index) {
            //
            ib = _renderer.loader.createIndexBuffer();
            _indexBuffers.push(ib);

        } else {
            ib = _indexBuffers[_index];
        }

        ib.loadData (
            new Uint16Array(_indices)
        );

        _vertexPositions = [];
        _vertexColors = [];
        _vertexTextureCoordinates = [];
        _indices = [];
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

        for (var i=0; i<=_index; i++) {
            //
            _renderer.setSampler (
                _uniformLocations.sampler,
                _textures[i]
            );

            // 1. Vertex positions.
            _renderer.setAttribute (
                _attributeLocations.vertexPosition,
                _vertexBuffers.position[i]
            );

            // 2. Vertex colors.
            _renderer.setAttribute (
                _attributeLocations.vertexColor,
                _vertexBuffers.color[i]
            );

            // 3. Vertex texture coordinates.
            _renderer.setAttribute (
                _attributeLocations.vertexTextureCoordinates,
                _vertexBuffers.textureCoordinates[i]
            );

            // 4. Indices.
            _renderer.drawIndexedPrimitives (
                _indexBuffers[i],
                PrimitiveType.TRIANGLE_LIST,
                Sprite2.INDEX_COUNT * _spriteCounts[i]
            );
        }
    }

    function clear() {
        //
        _db = [];

        if (_clearsDbAfterDrawing === false) {
            _isOkToAddItem = true;
        }
    }

    //
    // Priviledged methods.
    //
    this.begin = function() {
        //
        _isBegun = true;

        _lastTexture = null;
        _index = -1;
    };

    this.drawSprite = function (
        texture,
        creationOptions,
        centerScreenPosition,
        screenSize,
        vertexColor,
        sourceTextureCoordinateRect
    ){
        if (_clearsDbAfterDrawing === false &&
            _isOkToAddItem === false) {
            return;
        }

        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        if (DepthBufferValues.isDepthOutOfRange(centerScreenPosition.z) === true) {
            return;
        }

        if (_lastTexture !== null &&
            _lastTexture !== texture) {
            //
            test();
        }        

        var sprite = new Sprite2 (
            _self,
            texture,
            creationOptions,
            centerScreenPosition,
            screenSize,
            vertexColor,
            sourceTextureCoordinateRect
        );

        var spriteCount = (
            _vertexPositions.length /
            (Sprite2.POSITION_SIZE * Sprite2.VERTEX_COUNT)
        );
        
        var base = Sprite2.VERTEX_COUNT * spriteCount;

        _vertexPositions =
            _vertexPositions.concat(sprite.vertexPositions);

        _vertexColors =
            _vertexColors.concat(sprite.vertexColors);

        _vertexTextureCoordinates =
            _vertexTextureCoordinates.concat(sprite.vertexTextureCoordinates);

        _indices = _indices.concat ([
            base+0, base+1, base+2,
            base+2, base+1, base+3
        ]);

        _db.push(sprite);

        _lastTexture = texture;
    };    

    this.end = function() {
        //
        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        test();

        if (0 < _db.length) {
            //
            if (// Part 1.
                _clearsDbAfterDrawing === true || 
                // Part 2.
               (_clearsDbAfterDrawing === false &&
                _isOkToAddItem === true)) {
                //
                if (_clearsDbAfterDrawing === false) {
                    _isOkToAddItem = false;
                }
            }

            // Flushes the deferred items.
            flush();

            if (_clearsDbAfterDrawing === true) {
                //
                // Clears the deferred items.
                clear();
            }
        }

        _textures = [];
        _spriteCounts = [];

        _isBegun = false;
    };
}

//
// Static constants (after Object.freeze()).
//
SpriteBatch2.VERTEX_SHADER_SOURCE = [
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
        // Converts the vertex position from screen space to clip space (not NDC
        // yet).
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

SpriteBatch2.FRAGMENT_SHADER_SOURCE = [
    //
   'precision mediump float;', // which is the recommended fragment shader precision.

   'varying vec4 color;',
   'varying vec2 textureCoordinates;',

   'uniform sampler2D sampler;',

   'void main() {',
       'gl_FragColor = color * texture2D(sampler, textureCoordinates);',
   '}'
   
].join('\n');

SpriteBatch2.DEFAULT_OF_IF_CLEARS_DB_AFTER_DRAWING = true;
SpriteBatch2.DEFAULT_OF_IF_DB_FREQUENTLY_CHANGED = true;

Object.freeze(SpriteBatch2);

export { SpriteBatch2 };
