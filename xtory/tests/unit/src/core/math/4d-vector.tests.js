var assert = require('assert');
var xc = require('../../../dist/xtory.core.cjs.js');

describe('xtory.core.math.Vector4D', function() {
    //
    specify('constants', function() {
        //
        assert(xc.Vector4D.ELEMENT_COUNT === 4); // (x, y, z, w)
    });
});
