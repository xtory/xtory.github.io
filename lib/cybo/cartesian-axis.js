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
    // Constants.
    //
    Object.defineProperty(CartesianAxis, "X", {
        get: function() { return 0; }
    });

    Object.defineProperty(CartesianAxis, "Y", {
        get: function() { return 1; }
    });

    Object.defineProperty(CartesianAxis, "Z", {
        get: function() { return 2; }
    });

    return CartesianAxis;
});
