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
    // var _vertexPositions;
    // var _vertexColors;
    var _canvasClientSize; // which is a Float32Array.
    var _indices;
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

        _canvasClientSize = new Float32Array(2);

        setUpShaders();

        // Helpers.
        _isBegun = false;
        _isOkToAddItem = true;

    } catch (e) {
        //
        console.log('g2l.LineSegment2DBatch: ' + e);

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
            'position': _renderer.loader.createVertexBuffer(),
            'color': _renderer.loader.createVertexBuffer()
        };

        // _vertexPositions = [];
        // _vertexColors = [];

        _vertexArrays = {
            'position': [],
            'color': [],
            'position2': [],
            'color2': []
            // 'position3': null, // which is a Float32Array.
            // 'color3': null     // which is a Float32Array.
        };
    }

    function setUpIndexBuffers() {
        //
        _indexBuffer = _renderer.loader.createIndexBuffer();

        _indices = [];
    }

    function setUpShaders() {
        //
        _program = _renderer.loader.setUpProgram (
            LineSegment2DBatch.VERTEX_SHADER_SOURCE,
            LineSegment2DBatch.FRAGMENT_SHADER_SOURCE
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
        // if (_vertexArrays.position3 === null ||
        //     _vertexArrays.position3.length < _vertexArrays.position2.length) {
        //     //
        //     _vertexArrays.position3 =
        //         new Float32Array(_vertexArrays.position2.length);
        // }

        _vertexBuffers.position.loadData (
            new Float32Array(_vertexArrays.position2), //new Float32Array(_vertexPositions),
            LineSegment2D.POSITION_SIZE
        );

        _vertexBuffers.color.loadData (
            new Float32Array(_vertexArrays.color2), //new Float32Array(_vertexColors),
            LineSegment2D.COLOR_SIZE
        );

        _indexBuffer.loadData (
            new Uint16Array(_indices)
        );
        
        _renderer.program = _program;

        _renderer.setAttribute (
            _attributeLocations.vertexPosition,
            _vertexBuffers.position
        );

        _renderer.setAttribute (
            _attributeLocations.vertexColor,
            _vertexBuffers.color
        );

        _canvasClientSize[0] = _renderer.canvas.clientWidth;
        _canvasClientSize[1] = _renderer.canvas.clientHeight;

        _renderer.setVector2DUniform (
            _uniformLocations.canvasClientSize,
            _canvasClientSize
        );
        
        _renderer.drawIndexedPrimitives (
            _indexBuffer,
            PrimitiveType.TRIANGLE_LIST,
            LineSegment2D.INDEX_COUNT * _db.length
        );
    }

    function clear() {
        //
        _indices = [];
        // _vertexColors = [];
        // _vertexPositions = [];
        _vertexArrays.color2 = [];
        _vertexArrays.position2 = [];

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
        //var vb1, vb2; // vertex buffers.
        var index = _db.length;

        // 1. Vertex arrays.
        if (_vertexArrays.position.length - 1 < index) {
            //
            va1 = [];
            _vertexArrays.position.push(va1);

            // vb1 = _renderer.loader.createVertexBuffer();
            // _vertexBuffers.position.push(vb1);

        } else { // index <=  _vertexArrays.position.length - 1
            //
            va1 = _vertexArrays.position[index];
            //vb1 = _vertexBuffers.position[index];
        }

        // 2. Vertex colors.
        if (_vertexArrays.color.length - 1 < index) {
            //
            va2 = [];
            _vertexArrays.color.push(va2);

            // vb2 = _renderer.loader.createVertexBuffer();
            // _vertexBuffers.textureCoordinates.push(vb2);

        } else { // index <= _vertexArrays.color.length - 1
            //
            va2 = _vertexArrays.color[index];
            //vb2 = _vertexBuffers.textureCoordinates[index];
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

        // _vertexPositions =
        //     _vertexPositions.concat(lineSegment.vertexPositions);
        _vertexArrays.position2 =
            _vertexArrays.position2.concat(va1);

        // 2. Vertex colors.
        // _vertexColors =
        //     _vertexColors.concat(lineSegment.vertexColors);
        _vertexArrays.color2 =
            _vertexArrays.color2.concat(va2);

        // 3. Indices.
        var base = LineSegment2D.VERTEX_COUNT * _db.length;
        for (var i=0; i<LineSegment2D.INDEX_COUNT; i++) {
            //
            //_indices.push(base + lineSegment.indices[i]);
            _indices.push(base + LineSegment2D.INDICES[i]);
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

Object.freeze(LineSegment2DBatch);

export { LineSegment2DBatch };
