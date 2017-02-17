"use strict";

define ([
    // No parameters.
], function (
    // No parameters.
){
    function Vector3D(_x, _y, _z) {
        //
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    Vector3D.prototype = {
        //
        // Methods.
        //
        add: function(v) {
            return Vector3D.addVectors(this, v);
        },

        subtract: function(v) {
            return Vector3D.subtractVectors(this, v);
        }
    };

    Object.defineProperty(Vector3D, "ELEMENT_COUNT", {
        get: function() { return 3; }
    });

    //
    // Static methods.
    //
    Vector3D.fromArray = function(a) {
        return new Vector3D(a[0], a[1], a[2]);
    }

    Vector3D.calculateUnitVectorOf = function(v) {
        //
        // *Note*
        // All XNA, SlimDX, and WPF don't react to the situation when sqrt =
        // 0, such as zero vector's normalization. But finally I decide to
        // code in the way as the book "Essential Mathematics for Games and
        // Interactive Applications" does.

        var sqrt = Math.Sqrt(v.X*v.X + v.Y*v.Y + v.Z*v.Z);

        if (sqrt < MathHelper.EPSILON) {
            //
            // *Note*
            // This engine doesn't throw a divide-by-zero exception when
            // normalizing Vector2D, Vector3D, Vector4D, Quaternion.
            /*
            console.log("divide-by-zero");
            */

            return new Vector3D(0, 0, 0);

        } else {
            //
            var s = 1.0 / sqrt;
            return new Vector3D(v.X*s, v.Y*s, v.Z*s);
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

    return Vector3D;
});
