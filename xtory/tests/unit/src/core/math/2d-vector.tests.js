var assert = require('assert');
var xc = require('../../../dist/xtory.core.cjs.js');

describe('xtory.core.math.Vector2D', function() {
    //
    specify('constants', function() {
        //
        assert(xc.Vector2D.ELEMENT_COUNT === 2); // (x, y)
    });
});
