import { LineSegment2D }           from './2d-line-segment';
import { LineSegment2DBatchStyle } from './2d-line-segment-batch-style';
import { PrimitiveType }           from './primitive-type';

//
// Constructor.
//
function LineSegment2DBatch(_renderer, _style) {
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
    var _vertexArrays;
    var _indices;
    var _canvasClientSize; // which is a Float32Array.
    var _isBegun;
    var _isOkToAddItem;

    try {
        //
        _self = this;

        if (_style === undefined) {
            _style = new LineSegment2DBatchStyle();
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
        console.log('gorilla.graphicsLibrary.LineSegment2DBatch: ' + e);

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
            position: _renderer.loader.createVertexBuffer(),
            color: _renderer.loader.createVertexBuffer()
        };

        _vertexArrays = {
            position: [],
            position2: undefined, // which is a Float32Array.
            color: [],
            color2: undefined // which is a Float32Array.
        };
    }

    function setUpIndexBuffers() {
        //
        _indexBuffer = _renderer.loader.createIndexBuffer();

        _indices = undefined;
    }

    function setUpShaders() {
        //
        _program = _renderer.loader.setUpProgram (
            LineSegment2DBatch.VERTEX_SHADER_SOURCE,
            LineSegment2DBatch.FRAGMENT_SHADER_SOURCE
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
            }
        };

        // Helpers.
        _canvasClientSize = new Float32Array([undefined, undefined]);
    }

    function setUpVertices() {
        //
        // 1. Vertex positions.
        var size = (
            LineSegment2D.POSITION_SIZE * // = 3.
            LineSegment2D.VERTEX_COUNT    // = 4.
        );

        var length = size * _db.length;

        if (_vertexArrays.position2 === undefined ||
            _vertexArrays.position2.length !== length) {
            _vertexArrays.position2 = new Float32Array(length);
        }

        for (var i=0; i<_db.length; i++) {
            //
            var item = _vertexArrays.position[i];

            for (var j=0; j<size; j++) {
                _vertexArrays.position2[size*i + j] = item[j];
            }
        }

        _vertexBuffers.position.loadData (
            _vertexArrays.position2,
            LineSegment2D.POSITION_SIZE
        );

        // 2: Vertex colors.
        size = (
            LineSegment2D.COLOR_SIZE * // = 4.
            LineSegment2D.VERTEX_COUNT // = 4.
        );
        
        length = size * _db.length;

        if (_vertexArrays.color2 === undefined ||
            _vertexArrays.color2.length !== length) {
            _vertexArrays.color2 = new Float32Array(length);
        }
        
        for (var i=0; i<_db.length; i++) {
            //
            var item = _vertexArrays.color[i];

            for (var j=0; j<size; j++) {
                _vertexArrays.color2[size*i + j] = item[j];
            }
        }

        _vertexBuffers.color.loadData (
            _vertexArrays.color2,
            LineSegment2D.COLOR_SIZE
        );
    }

    function setUpIndices() {
        //
        var size = LineSegment2D.INDEX_COUNT; // = 6.
        var length = size * _db.length;

        if (_indices === undefined ||
            _indices.length !== length) {
            _indices = new Uint16Array(length);
        }

        for (var i=0; i<_db.length; i++) {
            //
            var base = LineSegment2D.VERTEX_COUNT * i;

            for (var j=0; j<size; j++) {
                _indices[size*i + j] = base + LineSegment2D.INDICES[j];
            }
        }

        _indexBuffer.loadData(_indices);
    }

    function flush() {
        //
        _renderer.program = _program;

        _renderer.setAttribute (
            _attributeLocations.vertexPosition,
            _vertexBuffers.position
        );

        _renderer.setAttribute (
            _attributeLocations.vertexColor,
            _vertexBuffers.color
        );

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

        _renderer.drawIndexedPrimitives (
            _indexBuffer,
            PrimitiveType.TRIANGLE_LIST,
            LineSegment2D.INDEX_COUNT * _db.length
        );
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

    this.drawLineSegment = function (
        screenPosition1,
        screenPosition2,
        screenThickness,
        color
    ){
        if (_style.clearsDbAfterDrawing === false &&
            _isOkToAddItem === false) {
            return;
        }

        if (_isBegun === false) {
            throw 'A begin-not-called-before-drawing exception raised.';
        }

        var va1, va2; // vertex arrays.
        var index = _db.length;

        // 1. Vertex arrays.
        if (_vertexArrays.position.length - 1 < index) {
            //
            va1 = [];
            _vertexArrays.position.push(va1);

        } else { // index <=  _vertexArrays.position.length - 1
            //
            va1 = _vertexArrays.position[index];
        }

        // 2. Vertex colors.
        if (_vertexArrays.color.length - 1 < index) {
            //
            va2 = [];
            _vertexArrays.color.push(va2);

        } else { // index <= _vertexArrays.color.length - 1
            //
            va2 = _vertexArrays.color[index];
        }

        var lineSegment = new LineSegment2D (
            // Part 1.
            _self,
            // Part 2.
            screenPosition1, screenPosition2,
            // Part 3.
            screenThickness,
            // Part 4.
            color,
            // Part 5.
            va1, va2
        );

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
                setUpVertices();

                setUpIndices();
                
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
LineSegment2DBatch.VERTEX_SHADER_SOURCE = [
    //
    'precision highp float;', // which is the default vertex shader precision.

    'attribute vec3 vertexPosition;',
    'attribute vec4 vertexColor;',

    'uniform vec2 canvasClientSize;',

    'varying vec4 _color;',

    'void main() {',
        //
        // Converts the (vertex) position from screen to 'clip' space with w = 1,
        // just like what ScreenCoordinateHelper.toClipSpace() does.
        'gl_Position = vec4 (',
            '-1.0 + 2.0 * (vertexPosition.xy / canvasClientSize.xy),',
            'vertexPosition.z,',
            '1.0',
        ');',

        '_color = vertexColor;',
    '}'

].join('\n');

LineSegment2DBatch.FRAGMENT_SHADER_SOURCE = [
    //
    'precision mediump float;', // which is the recommended fragment shader precision.

    'varying vec4 _color;',

    'void main() {',
        'gl_FragColor = _color;',
    '}'
   
].join('\n');

export { LineSegment2DBatch };
