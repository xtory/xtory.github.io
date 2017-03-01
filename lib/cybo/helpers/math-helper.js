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
    Object.defineProperty(MathHelper, "EPSILON", {
        get: function() { return 0.00001; } // = 1e-5; }
    });

    //
    // Static methods.
    //
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
