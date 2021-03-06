//
// Constructor.
//
function Texture2D(_textureLoader) {
    //
    var _self;
    var _gl;
    var _width;
    var _height;
    var _webGLTexture;

    try {
        //
        _self = this;
        _gl = _textureLoader.loader.renderer.gl;

    } catch (e) {
        //
        console.log('xtory.core.Texture2D: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'loader', {
        get: function() { return _loader; }
    });

    Object.defineProperty(_self, 'width', {
        get: function() { return _width; },
        set: function(value) { _width = value; }
    });

    Object.defineProperty(_self, 'height', {
        get: function() { return _height; },
        set: function(value) { _height = value; }
    });

    Object.defineProperty(_self, 'webGLTexture', {
        get: function() { return _webGLTexture; },
        set: function(value) { _webGLTexture = value; }
    });
}

export { Texture2D };
