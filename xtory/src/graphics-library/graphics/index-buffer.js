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
        console.log('gorilla.graphicsLibrary.IndexBuffer: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'bufferLoader', {
        get: function() { return _bufferLoader; }
    });

    Object.defineProperty(_self, 'webGLBuffer', {
        get: function() { return _webGLBuffer; }
    });
}

IndexBuffer.prototype = {
    //
    // Public methods.
    //
    loadData: function(data) {
        //
        var gl = this.bufferLoader.loader.renderer.gl;

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
                new Uint16Array(data),
                gl.STATIC_DRAW
            );

        } else {
            //
            gl.bufferData (
                gl.ELEMENT_ARRAY_BUFFER,
                new Uint32Array(data),
                gl.STATIC_DRAW
            );
        }
        */

        gl.bufferData (
            gl.ELEMENT_ARRAY_BUFFER,
            data, // which is already a Uint16Array.
            gl.STATIC_DRAW
        );
        // :Note
    }
};

export { IndexBuffer };
