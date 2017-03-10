import { MathHelper } from './helpers/math-helper';

//
// Constructor.
//
function Vector2D(_x, _y) {
    //
    this.x = _x;
    this.y = _y;
}

//
// Prototype.
//
Vector2D.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
Vector2D.ELEMENT_COUNT = 2;

//
// Static methods.
//
Vector2D.fromArray = function(a) {
    return new Vector2D(a[0], a[1]);
}

Vector2D.calculateUnitVectorOf = function(v) {
    //
    // Note:
    // All XNA, SlimDX, and WPF don't react to the situation when sqrt = 0, such
    // as zero vector's normalization. But finally I decide to code in the way as
    // the book 'Essential Mathematics for Games and Interactive Applications' does.

    var sqrt = Math.sqrt(v.x*v.x + v.y*v.y);

    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // Cybo doesn't throw a divide-by-zero exception when normalizing
        // Vector2D, Vector2D, Vector4D, Quaternion.
        /*
        console.log('A divide-by-zero exception raised.');
        */

        return new Vector2D(0, 0);

    } else {
        //
        var s = 1.0 / sqrt;
        return new Vector2D(v.x*s, v.y*s);
    }
}

Vector2D.negateVector = function (v) {
    return new Vector2D(-v.x, -v.y);
}

Vector2D.addVectors = function(v1, v2) {
    return new Vector2D(v1.x+v2.x, v1.y+v2.y);
}

Vector2D.subtractVectors = function(v1, v2) {
    return new Vector2D(v1.x-v2.x, v1.y-v2.y);
}

Vector2D.areEqual = function(v1, v2) {
    //
    if ((v1 instanceof Vector2D) === false ||
        (v2 instanceof Vector2D) === false) {
        return false;
    }

    if (v1.x !== v2.x ||
        v1.y !== v2.y) {
        return false;
    } else {
        return true;
    }
}

Object.freeze(Vector2D);

export { Vector2D };
