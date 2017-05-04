var assert = require('assert');
var xc = require('../../../dist/xtory.core.cjs.js');

describe('xtory.core.math.Matrix4x4', function() {
    //
    specify('constants', function() {
        //
        assert(xc.Matrix4x4.ELEMENT_COUNT === 16);
    });
});
