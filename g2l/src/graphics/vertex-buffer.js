//
// Constructor.
//
function VertexBuffer(_gl) {
    //
    var _webGLBuffer;
    var _size; // Number of components per vertex attribute. Must be 1, 2, 3, or 4.

    try {
        //
        _webGLBuffer = _gl.createBuffer();

    } catch (e) {
        //
        console.log('VertexBuffer: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'gl', {
        'get': function() { return _gl; }
    });

    Object.defineProperty(this, 'webGLBuffer', {
        'get': function() { return _webGLBuffer; }
    });

    Object.defineProperty(this, 'size', {
        'get': function() { return _size; },
        'set': function(value) { _size = value; }
    });
}

VertexBuffer.prototype = {
    //
    // Public methods.
    //
    setItems: function(items, size) {
        //
        var gl = this.gl;

        this.size = size;
        //_itemCount = items.length / _itemSize;

        // if ((item.length % _itemSize) !== 0) {
        //     console.log('(item.length % _itemSize) !== 0');
        // }

        gl.bindBuffer (
            gl.ARRAY_BUFFER,
            this.webGLBuffer
        );
        
        gl.bufferData (
            gl.ARRAY_BUFFER,
            new Float32Array(items),
            gl.STATIC_DRAW
        );
    }
}

Object.freeze(VertexBuffer);

export { VertexBuffer };