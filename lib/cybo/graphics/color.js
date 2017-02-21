define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function Color(r, g, b, a) {
        //
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    //
    // Prototype.
    //
    Color.prototype = {
        //
        // Public methods.
        //
        toArray: function() {
            return [ this.r, this.g, this.b, this.a ];
        }
    };

    return Color;
});
