define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function EaseMode() {
        // No contents.
    }

    //
    // Prototype.
    //
    EaseMode.prototype = {
        // No contents.
    };

    //
    // Constants.
    //
    Object.defineProperty(EaseMode, "EASE_IN", {
        get: function() { return 0; }
    });

    Object.defineProperty(EaseMode, "EASE_OUT", {
        get: function() { return 1; }
    });

    Object.defineProperty(EaseMode, "EASE_IN_OUT", {
        get: function() { return 2; }
    });

    return EaseMode;
});
