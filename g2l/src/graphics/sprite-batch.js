//
// Constructor.
//
function SpriteBatch(_gl) {
    //
    var _self;
    var _webGLTexture;
    var _width;
    var _height;

    try {
        //
        _self = this;
        
        _webGLTexture = _gl.createTexture();

    } catch (e) {
        //
        console.log('g2l.Texture2D: '+ e);

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

Object.freeze(SpriteBatch);

export { SpriteBatch };
