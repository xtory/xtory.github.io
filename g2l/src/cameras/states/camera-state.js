//
// Constructor.
//
function CameraState(_camera) {
    //
    var _self;

    try {
        //
        _self = this;
        
    } catch (e) {
        //
        console.log('g2l.CameraState: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'camera', {
        get: function() { return _camera; }
    });
}

CameraState.prototype = {
    //
    // Public methods.
    //
    update: function() {
        //
        // No contents.
    }
};

Object.freeze(CameraState);

export { CameraState };
