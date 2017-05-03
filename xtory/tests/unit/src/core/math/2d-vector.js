var assert = require('assert');
var xc = require('../../../dist/xtory.core.js');

describe('xtory.core.math.Vector2D', function() {
    //
    specify('areEqual()', function() {
        //
        var v1 = new xc.Vector2D(1, 2);
        var v2 = new xc.Vector2D(1, 2);
        var v3 = new xc.Vector2D(3, 4);

        assert(xc.Vector2D.areEqual(v1, v2) === true, 'pass!');
        assert(xc.Vector2D.areEqual(v1, v3) === false, 'pass!');
    });
});
