//
// Constructor.
//
function Texture2D(_textureLoader) {
    //
    var _gl;
    var _webGLTexture;
    var _width;
    var _height;

    try {
        //
        _gl = _textureLoader.loader.renderer.gl;

        _webGLTexture = _gl.createTexture();

    } catch (e) {
        //
        console.log('g2l.Texture2D: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'loader', {
        'get': function() { return _loader; }
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
