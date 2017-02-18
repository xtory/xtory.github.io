define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    function CartesianAxis() {
        // No contents.
    }

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
