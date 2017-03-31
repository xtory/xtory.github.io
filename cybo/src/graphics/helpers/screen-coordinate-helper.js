// Note:
// NDC stands for 'normalized device coordinates'.

import { NormalizedDeviceCoordinates  } from '../normalized-device-coordinates';
import { Vector3D  } from '../../math/3d-vector';

//
// Constructor.
//
function ScreenCoordinateHelper() {
    // No contents.
}

//
// Static methods.
//
ScreenCoordinateHelper.toClipSpace = function(viewport, p) {
    //
    // Note:
    // Because the input is already a 'screen position', that is, we don't have
    // to worry about the w component (which is related to 'perspective division').
    // The formula below converts the screen position directly to clip space.

    // Note:
    // Besides, OpenGL has no half-pixel offset problem like Direct3D 9, don't
    // have to handle it.
    /*
    return new Vector2D (
        // Part 1.
        NormalizedDeviceCoordinates.MIN_X +
        ((p.x - 0.5) / viewport.width) *
        (NormalizedDeviceCoordinates.MAX_X - NormalizedDeviceCoordinates.MIN_X),
        // Part 2.
        NormalizedDeviceCoordinates.MIN_Y +
        ((p.y - 0.5) / viewport.height) *
        (NormalizedDeviceCoordinates.MAX_Y - NormalizedDeviceCoordinates.MIN_Y),
        // Part 3.
        p.z
    );
    */

    return new Vector3D (
        // Part 1.
        NormalizedDeviceCoordinates.MIN_X + // = -1
        (p.x / viewport.width) *
        (NormalizedDeviceCoordinates.MAX_X - NormalizedDeviceCoordinates.MIN_X), // = 2
        // Part 2.
        NormalizedDeviceCoordinates.MIN_Y + // = -1
        (p.y / viewport.height) *
        (NormalizedDeviceCoordinates.MAX_Y - NormalizedDeviceCoordinates.MIN_Y), // = 2
        // Part 3.
        NormalizedDeviceCoordinates.MIN_Z + // -1
        p.z *
        (NormalizedDeviceCoordinates.MAX_Z - NormalizedDeviceCoordinates.MIN_Z) // = 2
    );
    // :Note
}

Object.freeze(ScreenCoordinateHelper);

export { ScreenCoordinateHelper };
