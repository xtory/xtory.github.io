import { LineSegment }           from './line-segment';
import { LineSegmentBatchStyle } from './line-segment-batch-style';
import { PrimitiveType }         from './primitive-type';

//
// Constructor.
//
function LineSegmentBatch(_renderer, _style) {
    //
    var _self;
    var _gl;
    var _db;

    var _vertexBuffers;
    var _indexBuffer;

    // Shaders.
    var _program;
    var _attributeLocations;
    var _uniformLocations;

    // Helpers.
    var _vertexPositions;
    var _vertexColors;
    var _indices;
    var _isBegun;
    var _isOkToAddItem;

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new LineSegmentBatchStyle();
        }

        _gl = _renderer.gl;

        _db = [];

        setUpVertexBuffers();

        setUpIndexBuffers();

        setUpShaders();

        // Helpers.
        _isBegun = false;
        _isOkToAddItem = true;

    } catch (e) {
        //
        console.log('g2l.LineSegmentBatch: ' + e);

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
        // _vertexBuffers = {
        //     position: [],
        //     color: []
        // };

        _vertexBuffers = {
            'position': _renderer.loader.createVertexBuffer(),
            'color': _renderer.loader.createVertexBuffer()
        };

        _vertexPositions = [];
        _vertexColors = [];

        // _defaultVertexBuffers = {
        //     color: _renderer.loader.createVertexBuffer(),
        //     textureCoordinates: _renderer.loader.createVertexBuffer()
        // };

        // _defaultVertexBuffers.color.loadData (
        //     Sprite.DEFAULT_VERTEX_COLORS,
        //     Sprite.COLOR_SIZE
        // );

        // _defaultVertexBuffers.textureCoordinates.loadData (
        //     Sprite.DEFAULT_VERTEX_TEXTURE_COORDINATES,
        //     Sprite.TEXTURE_COORDINATE_SIZE
        // );
    }

    function setUpIndexBuffers() {
        //
        _indexBuffer = _renderer.loader.createIndexBuffer();
        _indices = [];
    }

    function setUpShaders() {
        //
        _program = _renderer.loader.setUpProgram (
            LineSegmentBatch.VERTEX_SHADER_SOURCE,
            LineSegmentBatch.FRAGMENT_SHADER_SOURCE
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
            )
        };

        _uniformLocations = {
            //
            'canvasClientSize': _renderer.getUniformLocation (
                _program,
               'canvasClientSize'
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

        _vertexBuffers.position.loadData (
            new Float32Array(_vertexPositions),
            LineSegment.POSITION_SIZE
        );

        _vertexBuffers.color.loadData (
            new Float32Array(_vertexColors),
            LineSegment.COLOR_SIZE
        );

        _indexBuffer.loadData (
            new Uint16Array(_indices)
        );
        
        _renderer.setAttribute (
            _attributeLocations.vertexPosition,
            _vertexBuffers.position
        );

        _renderer.setAttribute (
            _attributeLocations.vertexColor,
            _vertexBuffers.color
        );

        _renderer.drawIndexedPrimitives (
            _indexBuffer,
            PrimitiveType.TRIANGLE_LIST,
            LineSegment.INDEX_COUNT * _db.length
        );
    }

    function clear() {
        //
        _indices = [];
        _vertexPositions = [];
        _vertexColors = [];

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

    this.drawLineSegment = function (
        screenPosition1,
        screenPosition2,
        color,
        screenThickness
    ){
        if (_style.clearsDbAfterDrawing === false &&
            _isOkToAddItem === false) {
            return;
        }

        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        var lineSegment = new LineSegment (
            _self,
            screenPosition1, screenPosition2,
            color,
            screenThickness
        );

        //var vb;
        //var index = _db.length;
        
        // 1. Vertex positions.
        // if (_vertexBuffers.position.length - 1 < index) {
        //     //
        //     vb = _renderer.loader.createVertexBuffer();
        //     _vertexBuffers.position.push(vb);

        // } else {
        //     //
        //     vb = _vertexBuffers.position[index];
        // }

        // vb.loadData (
        //     lineSegment.vertexPositions,
        //     LineSegment.POSITION_SIZE
        // );
        _vertexPositions =
            _vertexPositions.concat(lineSegment.vertexPositions);

        // 2. Vertex colors.
        // if (_vertexBuffers.color.length - 1 < index) {
        //     //
        //     vb = _renderer.loader.createVertexBuffer();
        //     _vertexBuffers.color.push(vb);

        // } else {
        //     //
        //     vb = _vertexBuffers.color[index];
        // }

        // vb.loadData (
        //     lineSegment.vertexColors,
        //     LineSegment.COLOR_SIZE
        // );
        _vertexColors =
            _vertexColors.concat(lineSegment.vertexColors);

        //var base = LineSegment.INDEX_COUNT * _db.length;
        var base = LineSegment.VERTEX_COUNT * _db.length;
        for (var i=0; i<LineSegment.INDEX_COUNT; i++) {
            //
            _indices.push(base + lineSegment.indices[i]);
        }

        _db.push(lineSegment);
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
LineSegmentBatch.VERTEX_SHADER_SOURCE = [
    //
   'precision highp float;', // which is the default vertex shader precision.

   'attribute vec3 vertexPosition;',
   'attribute vec4 vertexColor;',

   'varying vec4 color;',

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
   '}'

].join('\n');

LineSegmentBatch.FRAGMENT_SHADER_SOURCE = [
    //
   'precision mediump float;', // which is the recommended fragment shader precision.

   'varying vec4 color;',

   'void main() {',
       'gl_FragColor = color;',
   '}'
   
].join('\n');

Object.freeze(LineSegmentBatch);

export { LineSegmentBatch };
