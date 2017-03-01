define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function Camera() {
        // No contents.
    }

    //
    // Prototype.
    //
    Camera.prototype = {
        // No contents.
    };

    //
    // Constants.
    //
    Object.defineProperty(Camera, "DEFAULT_FIELD_OF_VIEW_Y", {
        get: function() { return Math.PI / 4; },
    });

    Object.defineProperty(Camera, "DEFAULT_DISTANCE_TO_NEAR_PLANE", {
        get: function() { return 10; },
    });

    Object.defineProperty(Camera, "DEFAULT_DISTANCE_TO_FAR_PLANE", {
        get: function() { return 100000; },
    });

    return Camera;
});
