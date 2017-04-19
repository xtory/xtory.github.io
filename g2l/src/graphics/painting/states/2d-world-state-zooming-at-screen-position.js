import { World2DState } from './2d-world-state';
import { JSHelper } from '../../../helpers/js-helper';

//
// Constructor.
//
function World2DStateZoomingAtScreenPosition(_world) {
    //
    World2DState.call(this, _world);
}

JSHelper.inherit(World2DStateZoomingAtScreenPosition, World2DState);

Object.freeze(World2DStateZoomingAtScreenPosition);

export { World2DStateZoomingAtScreenPosition };
