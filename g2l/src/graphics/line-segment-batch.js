//
// Constructor.
//
function LineSegmentBatch(_renderer, _style) {
    //
    var _self;
    var _gl;
    var _db;
    var _isBegun;

    try {
        //
        _self = this;
        _gl = _bufferLoader.loader.renderer.gl;

        

    } catch (e) {
        //
        console.log('g2l.LineSegmentBatch: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        'get': function() { return _renderer; }
    });

    Object.defineProperty(_self, 'isBegun', {
        'get': function() { return _isBegun; }
    });
}

LineSegmentBatch.prototype = {
    //
    // Public methods.
    //
    
};

Object.freeze(LineSegmentBatch);

export { LineSegmentBatch };
