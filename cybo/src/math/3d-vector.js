import { MathHelper } from "./helpers/math-helper";
import { Vector4D } from "./4d-vector";

//
// Constructor.
//
function Vector3D(_x, _y, _z) {
    //
    this.x = _x;
    this.y = _y;
    this.z = _z;
}

//
// Prototype.
//
Vector3D.prototype = {
    //
    // Public methods.
    //
    add: function(v) {
        return Vector3D.addVectors(this, v);
    },

    subtract: function(v) {
        return Vector3D.subtractVectors(this, v);
    }
};

//
// Static constants (after Object.freeze()).
//
Vector3D.ELEMENT_COUNT = 3;

//
// Static methods.
//
Vector3D.fromArray = function(a) {
    return new Vector3D(a[0], a[1], a[2]);
}

Vector3D.calculateUnitVectorOf = function(v) {
    //
    // Note:
    // All XNA, SlimDX, and WPF don't react to the situation when sqrt =
    // 0, such as zero vector's normalization. But finally I decide to
    // code in the way as the book "Essential Mathematics for Games and
    // Interactive Applications" does.

    var sqrt = Math.Sqrt(v.x*v.x + v.y*v.y + v.z*v.z);

    if (sqrt < MathHelper.EPSILON) {
        //
        // Note:
        // Cybo doesn't throw a divide-by-zero exception when normalizing
        // Vector2D, Vector3D, Vector4D, Quaternion.
        /*
        console.log("A divide-by-zero exception raised.");
        */

        return new Vector3D(0, 0, 0);

    } else {
        //
        var s = 1.0 / sqrt;
        return new Vector3D(v.x*s, v.y*s, v.z*s);
    }
}

Vector3D.addVectors = function(v1, v2) {
    return new Vector3D(v1.x+v2.x, v1.y+v2.y, v1.z+v2.z);
}

Vector3D.subtractVectors = function(v1, v2) {
    return new Vector3D(v1.x-v2.x, v1.y-v2.y, v1.z-v2.z);
}

Vector3D.calculateDotProductOf = function(v1, v2) {
    return v1.x*v2.x + v1.y*v2.y + v1.z*v2.z;
}

Vector3D.calculateCrossProductOf = function(v1, v2) {
    //
    return new Vector3D (
        v1.y*v2.z - v1.z*v2.y,
        v1.z*v2.x - v1.x*v2.z,
        v1.x*v2.y - v1.y*v2.x
    );
}

Vector3D.transformPoint = function(m, p) {
    //
    var v = new Vector4D(p.x, p.y, p.z, 1);
    var v2 = Vector4D.Transform(m, v);

    var s = 1 / v2.w;
    return new Vector3D(v2.x*s, v2.y*s, v2.z*s);
}

Vector3D.transformVector = function(m, v) {
    //
    var v2 = new Vector4D(v.x, v.y, v.z, 0);
    v = Vector4D.Transform(m, v2);

    return new Vector3D(v.x, v.y, v.z);
}

Object.freeze(Vector3D);

export { Vector3D };
