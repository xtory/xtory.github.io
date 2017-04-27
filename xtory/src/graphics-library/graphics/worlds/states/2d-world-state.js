//
// Constructor.
//
function World2DState(_world) {
    //
    var _self;
    
    try {
        //
        _self = this;

    } catch (e) {
        //
        console.log('g2l.World2DState: ', e);

        throw e;
    }
    
    //
    // Properties.
    //
    Object.defineProperty(_self, 'world', {
        get: function() { return _world; }
    });
}

World2DState.prototype = {
    //
    // Public methods.
    //
    update: function() {
        //
        // No contents.
    }
};

export { World2DState };
