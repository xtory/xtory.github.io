//
// Constructor.
//
function MainState() {
    //
    var _self;

    try {
        //
        _self = this;
        
    } catch (e) {
        //
        console.log('MainState: ', e);

        throw e;
    }
}

MainState.prototype = {
    //
    // Public methods.
    //
    update: function() {
        //
        // No contents.
    }
};
