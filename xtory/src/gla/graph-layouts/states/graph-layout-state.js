//
// Constructor.
//
function GraphLayoutState(_layout) {
    //
    var _self;

    try {
        //
        _self = this;
        
    } catch (e) {
        //
        console.log('g2l.GraphLayoutState: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'layout', {
        get: function() { return _layout; }
    });
}

GraphLayoutState.prototype = {
    //
    // Public methods.
    //
    update: function() {
        //
        // No contents.
    }
};

export { GraphLayoutState };
