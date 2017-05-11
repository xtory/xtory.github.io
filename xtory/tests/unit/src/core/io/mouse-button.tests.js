var assert = require('assert');
var xc = require('../../../dist/xtory.core.cjs.js');

describe('xtory.core.io.MouseButton', function() {
    //
    specify('constants', function() {
        //
        // Note:
        // [References]
        // MouseEvent.button
        //
        // 0: Main button pressed, usually the left button or the un-initialized
        // state.
        assert(xc.MouseButton.LEFT === 0);
        
        // 1: Auxiliary button pressed, usually the wheel button or the middle
        // button (if present).
        assert(xc.MouseButton.MIDDLE === 1);

        // 2: Secondary button pressed, usually the right button.
        assert(xc.MouseButton.RIGHT === 2);
    });
});
