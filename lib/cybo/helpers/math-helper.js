// Note:
// The equivelant of this value in C is "FLT_EPSILON", and in the GNU C Library,
// http://www.gnu.org/software/libc/manual/html_node/Floating-Point-Parameters.html
// FLT_EPSILON is the difference between 1 and the smallest floating point number
// of type float that is greater than 1. It's not supposed to be greater than 1E-5.

// Note:
// C# float.Epsilon = 1.4013e-045f, which represents the smallest positive System.
// Single value greater than zero.

// Note:
// FLT_EPSILON is 1.192092896e-07F in <float.h>

// Note:
// SlimDX, Fly3D both define this value as 1e-6f and XNA uses 1e-4f, 1e-5f, or 1e-6f
// (in difference places) as epsilons. Cybo selects 1e-5f.

// Note:
// SlimDX uses the term ZeroTolerance to represent Epsilon.

// Note:
// In XNA, there is no such term called Epsilon. XNA directly uses 1e-4f, 1e-05f,
// 1e-06f or as epsilon. For instance...
// Ray.Intersects() directly uses 1e-05f as epsilon
// BoundingBox.Intersects() directly uses 1e-06f as epsilon, etc.

// Note:
// The equivelant in Fly3D of this value is "FY_EPS".
    
define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function MathHelper() {
        // No contents.
    }

    //
    // Constants.
    //
    // PI.
    Object.defineProperty(MathHelper, "PI_OVER_TWO", {
        get: function() { return 1.5707963267948966; } // = PI / 2
    });

    Object.defineProperty(MathHelper, "PI_OVER_FOUR", {
        get: function() { return 0.7853981633974483; } // = pi / 4
    });

    Object.defineProperty(MathHelper, "TWO_PI", {
        get: function() { return 6.2831853071795864; } // = pi * 2
    });

    Object.defineProperty(MathHelper, "PI_OVER_ONE_EIGHTY", {
        get: function() { return 0.0174532925199432; } // = pi / 180
    });

    Object.defineProperty(MathHelper, "ONE_EIGHTY_OVER_PI", {
        get: function() { return 57.2957795130823208; } // = 180 / pi
    });

    Object.defineProperty(MathHelper, "RADIANS_OF_FORTY_FIVE_DEGREES", {
        get: function() { return MathHelper.PI_OVER_FOUR; } // = MathHelper.toRadians(45)
    });

    Object.defineProperty(MathHelper, "RADIANS_OF_NINETY_DEGREES", {
        get: function() { return MathHelper.PI_OVER_TWO; } // = MathHelper.toRadians(90)
    });

    Object.defineProperty(MathHelper, "RADIANS_OF_ONE_EIGHTY_DEGREES", {
        get: function() { return Math.PI; } // = MathHelper.toRadians(180)
    });

    Object.defineProperty(MathHelper, "RADIANS_OF_THREE_SIXTY_DEGREES", {
        get: function() { return MathHelper.TWO_PI; } // = MathHelper.toRadians(360)
    });

    // Epsilon.
    Object.defineProperty(MathHelper, "EPSILON", {
        get: function() { return 0.00001; } // = 1e-5; }
    });           

    //
    // Static methods.
    //
    MathHelper.toRadians = function(degrees) {
        //
        // Note:
        // 1 radian = (180 / pi) degrees.
        // => 1 degree = (pi / 180) radians.
        // => n degrees = (pi / 180) * n radians.

        return MathHelper.PiOverOneEighty * degrees;
    },

    MathHelper.toDegrees = function(radians) {
        //
        // Note:
        // 1 radian = (180 / pi) degrees.
        // => n radians = (180 / pi) * n degrees.

        return MathHelper.OneEightyOverPi * radians;
    },

    MathHelper.isPowerOfTwo = function(value) {
        //
        if (typeof(value) !== "number") {
            throw "A not-a-number exception raised.";
        }
        
        // Note:
        // For instance,
        // 2  = 00000010 
        // 4  = 00000100 
        // 8  = 00001000 
        // 16 = 00010000
        //
        // => 
        // 2 - 1 = 1 = 00000001 
        // 4 - 1 = 3 = 00000011 
        // 8 - 1 = 7 = 00000111
        //
        // =>
        // 2 & 1 = 00000010 & 00000001 = 0 
        // 8 & 7 = 00001000 & 00000111 = 0

        if (value !== 0 &&
           (value & (value - 1)) === 0) {
            return true;
        } else {
            return false;
        }
    }

    return MathHelper;
});
