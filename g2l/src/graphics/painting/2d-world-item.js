//
// Constructor.
//
function World2DItem(_world) {
    //
    var _self;
    var _isEnabled;
    var _isVisible;
    var _isSelected;
    var _isOutOfBound;
    var _tag;

    try {
        //
        _self = this;

    } catch (e) {
        //
        console.log('g2l.World2DItem: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'world', {
        'get': function() { return _world; }
    });

    Object.defineProperty(_self, 'isEnabled', {
        //
        'get': function() {
            return _isEnabled;
        },

        'set': function(value) {
            //
            if (value === _isEnabled) {
                return;
            }

            _isEnabled = value;

            if (_isEnabled === true) {
                //
                _world.invalidateItems();
            }
        }
    });

    Object.defineProperty(_self, 'isVisible', {
        //
        'get': function() {
            //
            return _isVisible;
        },

        'set': function(value) {
            //
            if (value === _isVisible) {
                return;
            }

            _isVisible = value;

            // Note:
            // We don't have to check if updating items is needed (like what Is-
            // Enabled does) because whether this item is visible or not, we have
            // to update it.
            /*
            if (_isVisible === true) {
                //
                _world.invalidateItems();
            }
            */
        }
    });

    Object.defineProperty(_self, 'isSelected', {
        //
        'get': function() {
            //
            return _isSelected;
        },

        'set': function(value) {
            //
            if (value === _isSelected) {
                return;
            }

            _isSelected = value;

            // ...
        }
    });

    Object.defineProperty(_self, 'isOutOfBound', {
        //
        'get': function() {
            //
            if (_hasToCheckBounds === true) {
                //
                checkIfOutOfBounds();

                _hasToCheckBounds = false;
            }

            return _isOutOfBounds;
        },

        'set': function(value) {
            //
            if (value === _isOutOfBounds) {
                return;
            }

            _isOutOfBounds = value;

            // ...
        }
    });

    Object.defineProperty(_self, 'tag', {
        'get': function() { return _tag; },
        'set': function(value) { _tag = value; }
    });
}

Object.freeze(World2DItem);

export { World2DItem };
