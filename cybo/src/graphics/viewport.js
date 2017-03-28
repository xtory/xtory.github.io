// Note:
// OpenGL viewport's (X, Y) means the lower-left corner.
// DirectX viewport's (X, Y) means the upper-left corner.

// Note:
// DirectX uses Viewport to set { left, top, width, height, minDepth(near), maxDepth(far) }
// OpenGL uses gl.viewport() to set { left, bottom, width, height }
// and gl.depthRange() to set { nearDepth, farDepth }

import { NormalizedDeviceCoordinates  } from './normalized-device-coordinates';
import { Vector2D  } from '../math/2d-vector';

//
// Constructor.
//
function Viewport(_left, _bottom, _width, _height) {
    //
    this.left = _left;
    this.bottom = _bottom;
    this.width = _width;
    this.height = _height;

    //
    // Properties.
    //
    Object.defineProperty(this, 'aspectRatio', {
        get: function() { return _width / _height; }
    });

    // Priviledged methods.
    this.toNormalizedDeviceSpace = function(screenPosition) {
        //
        // Note:
        // Because the input is already a 'screen position', that is, we don't have
        // to worry about w (perspective division), the formula below converts the
        // screen position directly to normalized device coordinates.

        return new Vector2D (
            // Part 1.
            NormalizedDeviceCoordinates.MIN_X +
            ((screenPosition.x - 0.5) / _width) *
            (NormalizedDeviceCoordinates.MAX_X - NormalizedDeviceCoordinates.MIN_X),
            // Part 2.
            NormalizedDeviceCoordinates.MIN_Y +
            ((screenPosition.y - 0.5) / _height) *
            (NormalizedDeviceCoordinates.MAX_Y - NormalizedDeviceCoordinates.MIN_Y)
        );
    }
}

Object.freeze(Viewport);

export { Viewport };
