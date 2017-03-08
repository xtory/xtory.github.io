import { AxisGroup }   from '../helpers/axis-group';
import { MathHelper }  from '../math/helpers/math-helper';
import { Vector3D }    from '../math/3d-vector';
import { ViewFrustum } from '../math/view-frustum';
import { Matrix4x4 }   from '../math/4x4-matrix';

//
// Constructor.
//
function Camera (
    _scene,
    _position,
    _facingDirection,
    _upDirection,
    _distanceToNearPlane,
    _distanceToFarPlane
){
    var _viewMatrix;
    var _projectionMatrix;
    var _transform;
    var _viewFrustum;
    var _hasToUpdateViewMatrix;
    var _hasToUpdateProjectionMatrix;
    var _hasToRaiseTransformUpdatedEvent;
    var _lastViewportAspectRatio;
        
    try {
        //
        if (_position === undefined) {
            _position = new Vector3D(0, 0, 10000);
        }

        if (_facingDirection === undefined) {
            _facingDirection = Camera.DEFAULT_FACING_DIRECTION;
        }

        if (_upDirection === undefined) {
            _upDirection = Camera.DEFAULT_UP_DIRECTION;
        }

        if (_distanceToNearPlane === undefined) {
            _distanceToNearPlane = Camera.DEFAULT_DISTANCE_TO_NEAR_PLANE;
        }

        if (_distanceToFarPlane === undefined) {
            _distanceToFarPlane = Camera.DEFAULT_DISTANCE_TO_FAR_PLANE;
        }

        if (_distanceToNearPlane < Camera.MIN_DISTANCE_TO_NEAR_PLANE) {
            _distanceToNearPlane = Camera.MIN_DISTANCE_TO_NEAR_PLANE;
        }

        if (Camera.MAX_DISTANCE_TO_FAR_PLANE < _distanceToFarPlane) {
            _distanceToFarPlane = Camera.MAX_DISTANCE_TO_FAR_PLANE;
        }

        _viewFrustum = new ViewFrustum();

        Object.defineProperty(this, 'viewFrustum', {
            'get': function() { return _viewFrustum; }
        });

        _hasToUpdateViewMatrix           = true;
        _hasToUpdateProjectionMatrix     = true;
        _hasToRaiseTransformUpdatedEvent = true;
        
    } catch (e) {
        //
        console.log('Cybo.Camera: ', e);

        throw e;
    }

    //
    // Private methods.
    //
    function checkViewMatrix() {
        //
        if (_hasToUpdateViewMatrix === false) {
            return;
        }

        _viewMatrix = Matrix4x4.createViewMatrix (
            _position,
            _facingDirection,
            _upDirection
        );

        _hasToRaiseTransformUpdatedEvent = true;
        _hasToUpdateViewMatrix = false;
    }

    function checkProjectionMatrix() {
        //
        // Note:
        // Calculates the aspect ratio of "viewport", not "back buffer".

        // Temp: Change back to viewport later.
        var viewportAspectRatio =
            _scene.graphicsManager.viewport.aspectRatio;
        // var viewportAspectRatio =
        //     window.innerWidth / window.innerHeight;
        // :Temp

        // Note:
        // The values we want to compare are ratios, we can't just compare if
        // they are equal. The results could be different in the debug and re-
        // lease modes and this will cause subtle bugs. Be careful!
        /*
        if (viewportAspectRatio === _lastViewportAspectRatio) {
            return;
        }
        */

        // Temp:
        /*
        if (_hasToUpdateProjectionMatrix === false &&
            MathHelper.areEqual(viewportAspectRatio, _lastViewportAspectRatio) === true) {
            return;
        }
        */
        if (_hasToUpdateProjectionMatrix === false &&
            viewportAspectRatio === _lastViewportAspectRatio) {
            return;
        }
        // :Temp
        // :Note

        _lastViewportAspectRatio = viewportAspectRatio;

        _projectionMatrix = Matrix4x4.createProjectionMatrix (
            Camera.FIELD_OF_VIEW_Y,
            _lastViewportAspectRatio,
            _distanceToNearPlane,
            _distanceToFarPlane
        );

        _hasToRaiseTransformUpdatedEvent = true;
        _hasToUpdateProjectionMatrix = false;
    }

    //
    // Priviledged methods.
    //
    this.getViewMatrix = function(m) {
        //
        checkViewMatrix();
        m.elements = _viewMatrix.elements.slice();
    }

    this.getProjectionMatrix = function(m) {
        //
        checkProjectionMatrix();
        m.elements = _projectionMatrix.elements.slice();
    }

    this.getTransform = function(m) {
        //
        // Checks the view matrix.
        checkViewMatrix();

        // Checks the projection matrix.
        checkProjectionMatrix();

        if (_hasToRaiseTransformUpdatedEvent === true) {
            //
            // Note:
            // _hasToRaiseTransformUpdatedEvent == true means _viewMatrix or
            // _projectionMatrix (or both) is recreated. So, _transform has
            // to be recalculated.

            // Recalculates the transform.
            _transform = Matrix4x4.multiplyMatrices (
                _projectionMatrix,
                _viewMatrix
            );
        }

        m.elements = _transform.elements.slice();

        // Raises the transform-updated event (if necessary).
        if (_hasToRaiseTransformUpdatedEvent === true) {
            // Temp:
            /*
            if (this.TransformUpdated != null) {
                this.TransformUpdated(this, EventArgs.Empty);
            }
            */

            _hasToRaiseTransformUpdatedEvent = false;
        }
    }
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
Camera.DEFAULT_FACING_DIRECTION       = Vector3D.negateVector(AxisGroup.Z_AXIS);
Camera.DEFAULT_UP_DIRECTION           = AxisGroup.Y_AXIS;
Camera.FIELD_OF_VIEW_Y                = MathHelper.PI_OVER_FOUR;           // = pi / 4
Camera.MIN_DISTANCE_TO_NEAR_PLANE     = 10;
Camera.MAX_DISTANCE_TO_FAR_PLANE      = 1000000;                           // = 10^6
Camera.DEFAULT_DISTANCE_TO_NEAR_PLANE = Camera.MIN_DISTANCE_TO_NEAR_PLANE; // = 10.
Camera.DEFAULT_DISTANCE_TO_FAR_PLANE  = 100000;                            // = 10^5

Object.freeze(Camera);

export { Camera };