var assert = require('assert');
var xc = require('../../../dist/xtory.core.js');

describe('xtory.core.math.Vector3D', function() {
    //
    specify('areEqual()', function() {
        //
        var v1 = new xc.Vector3D(1, 2, 3);
        var v2 = new xc.Vector3D(1, 2, 3);
        var v3 = new xc.Vector3D(4, 5, 6);

        assert(xc.Vector3D.areEqual(v1, v2) === true);
        assert(xc.Vector3D.areEqual(v1, v3) === false);
    });
});
