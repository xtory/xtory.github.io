// Note:
// NDC stands for 'normalized device coordinates'.

import { Ndc } from '../ndc';
import { Vector4D } from '../../math/4d-vector';

//
// Constructor.
//
function ScreenCoordinateHelper() {
    // No contents.
}

//
// Static methods.
//
ScreenCoordinateHelper.toClipSpace = function(canvas, p) {
    //
    // Note:
    // Because the input is already a 'screen position', that is, we don't have
    // to worry about the w component (which is related to 'perspective division').
    // The formula below converts the screen position directly to clip space.

    // Note:
    // Besides, OpenGL has no half-pixel offset problem like Direct3D 9, don't
    // have to handle it.

    // Note:
    // This engine uses a constant viewport. To get viewport size for displaying
    // (nor for drawing), use canvas.clientWidth and clientHeight instead.
    /*
    return new Vector3D (
        // Part 1.
        Ndc.MIN_X +
        ((p.x - 0.5) / viewport.width) *
        (Ndc.MAX_X - Ndc.MIN_X),
        // Part 2.
        Ndc.MIN_Y +
        ((p.y - 0.5) / viewport.height) *
        (Ndc.MAX_Y - Ndc.MIN_Y),
        // Part 3.
        p.z,
        // Part 4.
        1.0
    );
    */

    return new Vector4D (
        // Part 1.
        Ndc.MIN_X + // = -1
        (p.x / canvas.clientWidth) *
        (Ndc.MAX_X - Ndc.MIN_X), // = 2
        // Part 2.
        Ndc.MIN_Y + // = -1
        (p.y / canvas.clientHeight) *
        (Ndc.MAX_Y - Ndc.MIN_Y), // = 2
        // Part 3.
        Ndc.MIN_Z + // = -1
        p.z *
        (Ndc.MAX_Z - Ndc.MIN_Z), // = 2
        // Part 4.
        1.0 // w.
    );
    // :Note
};

Object.freeze(ScreenCoordinateHelper);

export { ScreenCoordinateHelper };
