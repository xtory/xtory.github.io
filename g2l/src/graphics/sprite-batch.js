//
// Constructor.
//
function SpriteBatch(_renderer) {
    //
    var _self;
    var _gl;

    try {
        //
        _self = this;
        _gl = _renderer.gl;

    } catch (e) {
        //
        console.log('g2l.SpriteBatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        'get': function() { return _renderer; }
    });
}

Object.freeze(SpriteBatch);

export { SpriteBatch };
