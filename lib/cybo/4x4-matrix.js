define ([
    "./cartesian-axis"
], function (
    CartesianAxis
){
    "use strict";
    
    //
    // Constructor.
    //
    function Matrix4x4 (
        _s11, _s12, _s13, _s14,
        _s21, _s22, _s23, _s24,
        _s31, _s32, _s33, _s34,
        _s41, _s42, _s43, _s44
    ){
        // Note:
        // When storing matrices in memory, there are two ways of storing their
        // elements:
        // 1. Stored in the order s11, s12, s13, ..., s43, s44
        // => called "row major" (used by DirectX), or
        // 2. Stored in the order s11, s21, s31, ..., s34, s44
        // => called "column major" (used by OpenGL, WebGL)

        // Note:
        // "m x n" matrix always means "m rows, n columns" whether it's row or
        // column major.

        this.elements = [
            _s11, _s21, _s31, _s41,
            _s12, _s22, _s32, _s42,
            _s13, _s23, _s33, _s43,
            _s14, _s24, _s34, _s44
        ];

        //
        // Properties.
        //
        Object.defineProperty(this, "s11", {
            get: function() { return this.elements[0]; }
        });

        Object.defineProperty(this, "s12", {
            get: function() { return this.elements[4]; }
        });

        Object.defineProperty(this, "s13", {
            get: function() { return this.elements[8]; }
        });

        Object.defineProperty(this, "s14", {
            get: function() { return this.elements[12]; }
        });

        Object.defineProperty(this, "s21", {
            get: function() { return this.elements[1]; }
        });

        Object.defineProperty(this, "s22", {
            get: function() { return this.elements[5]; }
        });

        Object.defineProperty(this, "s23", {
            get: function() { return this.elements[9]; }
        });

        Object.defineProperty(this, "s24", {
            get: function() { return this.elements[13]; }
        });

        Object.defineProperty(this, "s31", {
            get: function() { return this.elements[2]; }
        });

        Object.defineProperty(this, "s32", {
            get: function() { return this.elements[6]; }
        });

        Object.defineProperty(this, "s33", {
            get: function() { return this.elements[10]; }
        });

        Object.defineProperty(this, "s34", {
            get: function() { return this.elements[14]; }
        });

        Object.defineProperty(this, "s41", {
            get: function() { return this.elements[3]; }
        });

        Object.defineProperty(this, "s42", {
            get: function() { return this.elements[7]; }
        });

        Object.defineProperty(this, "s43", {
            get: function() { return this.elements[11]; }
        });

        Object.defineProperty(this, "s44", {
            get: function() { return this.elements[15]; }
        });
    }

    //
    // Prototype.
    //
    Matrix4x4.prototype = {
        //
        // Public methods.
        //
        multiply: function(m) {
            return Matrix4x4.multiplyMatrices(this, m);
        }
    };

    //
    // Constants.
    //
    Object.defineProperty(Matrix4x4, "ELEMENT_COUNT", {
        get: function() { return 16; }
    });

    //
    // Static methods.
    //
    Matrix4x4.fromArray = function(a) {
        //
        return new Matrix4x4 (
            a[0], a[4], a[ 8], a[12],
            a[1], a[5], a[ 9], a[13],
            a[2], a[6], a[10], a[14],
            a[3], a[7], a[11], a[15]
        );
    }
    
    Matrix4x4.createIdentityMatrix = function() {
        //
        return new Matrix4x4 (
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    Matrix4x4.createViewMatrix = function (
        cameraPosition,
        cameraTargetPosition,
        cameraUpDirection
    ){  //
        // Formula of the Direct3D Matrix.LookAtRH method:
        //
        // [ axisX.x                      axisY.x                      axisZ.x                     0
        //   axisX.y                      axisY.y                      axisZ.y                     0
        //   axisX.z                      axisY.z                      axisZ.z                     0
        //  -dot(axisX, cameraPosition)  -dot(axisY, cameraPosition)  -dot(axisZ, cameraPosition)  1 ]
        //
        // where
        // axisZ = normal(cameraPosition - cameraTargetPosition)
        // axisX = normal(cross(cameraUpVector, axisZ))
        // axisY = cross(axisZ, axisX)
        //
        var axisX, axisY, axisZ, v;
        
        v = Vector3D.subtractVectors (
            cameraPosition,
            cameraTargetPosition
        );

        axisZ = Vector3D.calculateUnitVectorOf(v);
        v = Vector3D.calculateCrossProductOf(cameraUpDirection, axisZ);
        axisX = Vector3D.calculateUnitVectorOf(v);
        axisY = Vector3D.calculateCrossProductOf(axisZ, axisX);

        var s11 = axisX.x;
        var s21 = axisY.x;
        var s31 = axisZ.x;
        var s41 = 0;

        var s12 = axisX.y;
        var s22 = axisY.y;
        var s32 = axisZ.y;
        var s42 = 0;

        var s13 = axisX.z;
        var s23 = axisY.z;
        var s33 = axisZ.z;
        var s43 = 0;

        var s14 = -Vector3D.calculateDotProductOf(axisX, cameraPosition);
        var s24 = -Vector3D.calculateDotProductOf(axisY, cameraPosition);
        var s34 = -Vector3D.calculateDotProductOf(axisZ, cameraPosition);
        var s44 = 1;

        return new Matrix4x4 (
            s11, s12, s13, s14,
            s21, s22, s23, s24,
            s31, s32, s33, s34,
            s41, s42, s43, s44
        );
    }

    Matrix4x4.createProjectionMatrix = function (
        fovY = Math.PI / 4, // fieldOfViewY
        aspectRatio,
        near = 10,          // distanceToNearPlane
        far  = 100000       // distanceToFarPlane
    ){  //
        // Formula of the Direct3D Matrix.PerspectiveFovRH method:
        //
        // [ w    0    0                      0
        //   0    h    0                      0
        //   0    0    far/(near-far)        -1
        //   0    0    near*far/(near-far)    0 ]
        //
        // where
        // h = cot(fovY/2) = 1 / tan(fovY/2)
        // w = h / aspectRatio
        //
        var w, h;

        h = 1.0 / Math.tan(fovY / 2.0);
        w = h / aspectRatio;

        var a = [];

        a[0] = w;
        a[1] = 0;
        a[2] = 0;
        a[3] = 0;

        a[4] = 0;
        a[5] = h;
        a[6] = 0;
        a[7] = 0;

        a[ 8] =  0;
        a[ 9] =  0;
        a[10] = far / (near - far);
        a[11] = -1;

        a[12] = 0;
        a[13] = 0;
        a[14] = near * far / (near - far);
        a[15] = 0;

        return Matrix4x4.fromArray(a);
    }

    Matrix4x4.createScaleMatrix = function(v) {
        //
		return new Matrix4x4 (
            v.x, 0,   0,   0,
            0,   v.y, 0,   0,
            0,   0,   v.z, 0,
            0,   0,   0,   1
        );
	}

    Matrix4x4.createRotationMatrix = function (
        cartesianAxis,
        angle // in radians.
    ){
        var cosine = Math.cos(angle);
        var sine   = Math.sin(angle);

		switch (cartesianAxis) {
            //
            case CartesianAxis.X: {
                //
                return new Matrix4x4 (
                    1,    0,         0,         0,
                    0,    cosine,    sine,      0,
                    0,   -sine,      cosine,    0,
                    0,    0,         0,         1
                );
            }

            case CartesianAxis.Y: {
                //
                return new Matrix4x4 (
                    cosine,    0,   -sine,      0,
                    0,         1,    0,         0,
                    sine,      0,    cosine,    0,
                    0,         0,    0,         1
                );
            }

            case CartesianAxis.Z: {
                //
                return new Matrix4x4 (
                    cosine,    sine,      0,    0,
                   -sine,      cosine,    0,    0,
                    0,         0,         1,    0,
                    0,         0,         0,    1
                );
            }

            default: {
                console.log("A not-supported exception raised.");
                break;
            }
        }
	}

    Matrix4x4.createTranslationMatrix = function(v) {
        //
		return new Matrix4x4 (
            1, 0, 0, v.x,
            0, 1, 0, v.y,
            0, 0, 1, v.z,
            0, 0, 0,   1
        );
	}

    Matrix4x4.multiplyMatrices = function(m1, m2) {
        //
        var a1 = m1.elements;
		var a2 = m2.elements;
		var a3 = [];

		var a11=a1[0], a12=a1[4], a13=a1[ 8], a14=a1[12];
		var a21=a1[1], a22=a1[5], a23=a1[ 9], a24=a1[13];
		var a31=a1[2], a32=a1[6], a33=a1[10], a34=a1[14];
		var a41=a1[3], a42=a1[7], a43=a1[11], a44=a1[15];

		var b11=a2[0], b12=a2[4], b13=a2[ 8], b14=a2[12];
		var b21=a2[1], b22=a2[5], b23=a2[ 9], b24=a2[13];
		var b31=a2[2], b32=a2[6], b33=a2[10], b34=a2[14];
		var b41=a2[3], b42=a2[7], b43=a2[11], b44=a2[15];

		a3[ 0] = a11*b11 + a12*b21 + a13*b31 + a14*b41;
		a3[ 4] = a11*b12 + a12*b22 + a13*b32 + a14*b42;
		a3[ 8] = a11*b13 + a12*b23 + a13*b33 + a14*b43;
		a3[12] = a11*b14 + a12*b24 + a13*b34 + a14*b44;

		a3[ 1] = a21*b11 + a22*b21 + a23*b31 + a24*b41;
		a3[ 5] = a21*b12 + a22*b22 + a23*b32 + a24*b42;
		a3[ 9] = a21*b13 + a22*b23 + a23*b33 + a24*b43;
		a3[13] = a21*b14 + a22*b24 + a23*b34 + a24*b44;

		a3[ 2] = a31*b11 + a32*b21 + a33*b31 + a34*b41;
		a3[ 6] = a31*b12 + a32*b22 + a33*b32 + a34*b42;
		a3[10] = a31*b13 + a32*b23 + a33*b33 + a34*b43;
		a3[14] = a31*b14 + a32*b24 + a33*b34 + a34*b44;

		a3[ 3] = a41*b11 + a42*b21 + a43*b31 + a44*b41;
		a3[ 7] = a41*b12 + a42*b22 + a43*b32 + a44*b42;
		a3[11] = a41*b13 + a42*b23 + a43*b33 + a44*b43;
		a3[15] = a41*b14 + a42*b24 + a43*b34 + a44*b44;

		return Matrix4x4.fromArray(a3);
    }

    return Matrix4x4;
});
