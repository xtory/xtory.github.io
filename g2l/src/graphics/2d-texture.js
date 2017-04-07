//
// Constructor.
//
function Texture2D(_gl) {
    //
    var _webGLTexture;
    var _width;
    var _height;

    try {
        //
        _webGLTexture = _gl.createTexture();

    } catch (e) {
        //
        console.log('IndexBuffer: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'gl', {
        'get': function() { return _gl; }
    });

    Object.defineProperty(this, 'webGLTexture', {
        'get': function() { return _webGLTexture; }
    });

    Object.defineProperty(this, 'width', {
        'get': function() { return _width; },
        'set': function(value) { _width = value; }
    });

    Object.defineProperty(this, 'height', {
        'get': function() { return _height; },
        'set': function(value) { _height = value; }
    });    
}

Object.freeze(Texture2D);

export { Texture2D };
