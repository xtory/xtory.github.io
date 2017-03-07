define ([
    "../math/helpers/math-helper"
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
    // Static constants (after Object.freeze()).
    //
    Camera.DEFAULT_FIELD_OF_VIEW_Y        = MathHelper.PI_OVER_FOUR;           // = pi / 4
    Camera.MIN_DISTANCE_TO_NEAR_PLANE     = 10;
    Camera.MAX_DISTANCE_TO_FAR_PLANE      = 1000000;                           // = 10^6
    Camera.DEFAULT_DISTANCE_TO_NEAR_PLANE = Camera.MIN_DISTANCE_TO_NEAR_PLANE; // = 10.
    Camera.DEFAULT_DISTANCE_TO_FAR_PLANE  = 100000;                            // = 10^5

    Object.freeze(Camera);
    return Camera;
});
