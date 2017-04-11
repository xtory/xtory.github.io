//
// Constructor.
//
function IndexBuffer(_bufferLoader) {
    //
    var _self;
    var _gl;
    var _webGLBuffer;

    try {
        //
        _self = this;
        _gl = _bufferLoader.loader.renderer.gl;

        _webGLBuffer = _gl.createBuffer();

    } catch (e) {
        //
        console.log('g2l.IndexBuffer: ' + e);

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
}

IndexBuffer.prototype = {
    //
    // Public methods.
    //
    setItems: function(items) {
        //
        var gl = this.bufferLoader.loader.renderer.gl;

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
        var gl = this.loader.renderer.gl;

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
