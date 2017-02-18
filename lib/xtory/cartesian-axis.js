define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    function CartesianAxis() {
        // No contents.
    }

    Object.defineProperty(CartesianAxis, "x", {
        get: function() { return 0; }
    });

    Object.defineProperty(CartesianAxis, "y", {
        get: function() { return 1; }
    });

    Object.defineProperty(CartesianAxis, "z", {
        get: function() { return 2; }
    });

    return CartesianAxis;
});
