//
// Constructor.
//
function CameraState(_camera) {
    //
    this.camera = _camera;
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
