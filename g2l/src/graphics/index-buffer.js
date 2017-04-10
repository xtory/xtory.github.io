//
// Constructor.
//
function IndexBuffer(_loader) {
    //
    var _webGLBuffer;

    try {
        //
        _webGLBuffer = _loader.gl.createBuffer();

    } catch (e) {
        //
        console.log('g2l.IndexBuffer: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'loader', {
        'get': function() { return _loader; }
    });

    Object.defineProperty(this, 'webGLBuffer', {
        'get': function() { return _webGLBuffer; }
    });
}

IndexBuffer.prototype = {
    //
    // Public methods.
    //
    setItems: function(items) {
        //
        var gl = this.loader.gl;

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
