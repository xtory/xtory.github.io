var assert = require('assert');
var xc = require('../../../dist/xtory.core.cjs.js');

describe('xtory.core.math.Vector3D', function() {
    //
    specify('constants', function() {
        //
        assert(xc.Vector3D.ELEMENT_COUNT === 3); // (x, y, z)
    });
});
