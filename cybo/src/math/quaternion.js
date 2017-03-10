import { MathHelper } from './helpers/math-helper';

//
// Constructor.
//
function Quaternion(_x, _y, _z, _w) {
    //
    // The vector part.
    this.x = _x;
    this.y = _y;
    this.z = _z;

    // The scalar part.
    this.w = _w; // W isn't the rotation angle (in radians).
}

//
// Prototype.
//
Quaternion.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
Quaternion.ELEMENT_COUNT = 4;

//
// Static methods.
//
Quaternion.fromArray = function(a) {
    return new Quaternion(a[0], a[1], a[2], a[3]);
}

Quaternion.createIdentityQuaternion = function() {
    return new Quaternion(0, 0, 0, 1);
}

Quaternion.calculateUnitQuaternionOf = function(q) {
    //
    var sqrt = Math.sqrt(q.x*q.x + q.y*q.y + q.z*q.z +q.w*q.w);
    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // This engine doesn't throw a divide-by-zero exception when normalizing
        // Vector2D, Vector3D, Vector4D, Quaternion.
        /*
        console.log('A divide-by-zero exception raised.');
        */

        return new Quaternion(0, 0, 0, 0);

    } else {
        //
        var s = 1.0 / sqrt;

        return new Quaternion(q.x*s, q.y*s, q.z*s, q.w*s);
    }
}

Quaternion.areEqual = function(q1, q2) {
    //
    if ((q1 instanceof Quaternion) === false ||
        (q2 instanceof Quaternion) === false) {
        return false;
    }

    if (q1.x !== q2.x ||
        q1.y !== q2.y ||
        q1.z !== q2.z ||
        q1.w !== q2.w) {
        return false;
    } else {
        return true;
    }
}

Object.freeze(Quaternion);

export { Quaternion };
