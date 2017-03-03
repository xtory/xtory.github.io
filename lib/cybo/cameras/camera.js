define ([
    "../helpers/math-helper"
], function (
    MathHelper
){
    "use strict";
    
    //
    // Constructor.
    //
    function Camera (
        _scene,
        _position, _facingDirection, _upDirection,
        _distanceToNearPlane, _distanceToFarPlane
    ){
        //if (_distanceToFarPlane <)
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
        get: function() { return MathHelper.PI_OVER_FOUR; } // = Math.PI / 4
    });

    Object.defineProperty(Camera, "MIN_DISTANCE_TO_NEAR_PLANE", {
        get: function() { return 10; }
    });

    Object.defineProperty(Camera, "MAX_DISTANCE_TO_FAR_PLANE", {
        get: function() { return 1000000; } // = 10^6
    });

    Object.defineProperty(Camera, "DEFAULT_DISTANCE_TO_NEAR_PLANE", {
        get: function() { return Camera.MIN_DISTANCE_TO_NEAR_PLANE; } // = 10.
    });

    Object.defineProperty(Camera, "DEFAULT_DISTANCE_TO_FAR_PLANE", {
        get: function() { return 100000; } // = 10^5
    });

    return Camera;
});
