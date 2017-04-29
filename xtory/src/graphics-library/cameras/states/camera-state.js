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
        console.log('xtory.graphicsLibrary.CameraState: ', e);

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

export { CameraState };
