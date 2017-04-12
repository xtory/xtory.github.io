//
// Constructor.
//
function VertexBuffer(_bufferLoader) {
    //
    var _self;
    var _gl;
    var _webGLBuffer;
    var _size; // Number of components per vertex attribute. Must be 1, 2, 3, or 4.

    try {
        //
        _self = this;
        _gl = _bufferLoader.loader.renderer.gl;

        _webGLBuffer = _gl.createBuffer();

    } catch (e) {
        //
        console.log('g2l.VertexBuffer: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'bufferLoader', {
        'get': function() { return _bufferLoader; }
    });

    Object.defineProperty(_self, 'webGLBuffer', {
        'get': function() { return _webGLBuffer; }
    });

    Object.defineProperty(_self, 'size', {
        'get': function() { return _size; },
        'set': function(value) { _size = value; }
    });
}

VertexBuffer.prototype = {
    //
    // Public methods.
    //
    setData: function(data, size) {
        //
        var gl = this.bufferLoader.loader.renderer.gl;
        this.size = size;

        gl.bindBuffer (
            gl.ARRAY_BUFFER,
            this.webGLBuffer
        );
        
        gl.bufferData (
            gl.ARRAY_BUFFER,
            data, // which is already a Float32Array.
            gl.STATIC_DRAW
        );
    }
}

Object.freeze(VertexBuffer);

export { VertexBuffer };
