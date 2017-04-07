//
// Constructor.
//
function IndexBuffer(_gl) {
    //
    var _webGLBuffer = _gl.createBuffer();
    //var _itemCount;

    //
    // Properties.
    //
    Object.defineProperty(this, 'gl', {
        'get': function() { return _gl; }
    });

    Object.defineProperty(this, 'webGLBuffer', {
        'get': function() { return _webGLBuffer; }
    });

    // Object.defineProperty(this, 'ItemCount', {
    //     'get': function() { return _itemCount; }
    // });
}

IndexBuffer.prototype = {
    //
    // Public methods.
    //
    setItems: function(items) {
        //
        var gl = this.gl;

        //_itemCount = items.length;

        gl.bindBuffer (
            gl.ELEMENT_ARRAY_BUFFER,
            this.webGLBuffer
        );

        // Note:
        // DirectX supports 16-bit or 32-bit index buffers. But in this engine,
        // so far, only 16-bit index buffer is supported.
        /*
        if (uses16Bits === true) {
            //
            gl.bufferData (
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(items),
                gl.STATIC_DRAW
            );

        } else {
            //
            gl.bufferData (
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint32Array(items),
                gl.STATIC_DRAW
            );
        }
        */

        gl.bufferData (
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(items),
            gl.STATIC_DRAW
        );
        // :Note
    }
};

Object.defineProperty(IndexBuffer.prototype, 'items', {
    //
    'set': function(value) {
        //
        var gl = this.gl;

        gl.bindBuffer (
            gl.ELEMENT_ARRAY_BUFFER,
            buffer.webGLBuffer
        );

        // Note:
        // DirectX supports 16-bit or 32-bit index buffers. But in this engine,
        // so far, only 16-bit index buffer is supported.
        /*
        if (uses16Bits === true) {
            //
            gl.bufferData (
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(items),
                gl.STATIC_DRAW
            );

        } else {
            //
            gl.bufferData (
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint32Array(items),
                gl.STATIC_DRAW
            );
        }
        */

        gl.bufferData (
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(items),
            gl.STATIC_DRAW
        );
        // :Note
    }
});

Object.freeze(IndexBuffer);

export { IndexBuffer };
