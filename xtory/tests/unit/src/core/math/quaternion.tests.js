var assert = require('assert');
var xc = require('../../../dist/xtory.core.cjs.js');

describe('xtory.core.math.Quaternion', function() {
    //
    specify('constants', function() {
        //
        assert(xc.Quaternion.ELEMENT_COUNT === 4); // (x, y, z, w)
    });
});
