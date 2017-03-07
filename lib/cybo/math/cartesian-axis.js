define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function CartesianAxis() {
        // No contents.
    }

    //
    // Prototype.
    //
    CartesianAxis.prototype = {
        // No contents.
    };

    //
    // Static constants (after Object.freeze()).
    //
    CartesianAxis.X = 0;
    CartesianAxis.Y = 1;
    CartesianAxis.Z = 2;

    Object.freeze(CartesianAxis);
    return CartesianAxis;
});
