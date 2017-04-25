import { JSHelper } from '../../../helpers/js-helper';
import { World2DState } from './2d-world-state';

//
// Constructor.
//
function World2DStateNormal(_world) {
    //
    World2DState.call(this, _world);
}

JSHelper.inherit(World2DStateNormal, World2DState);

Object.freeze(World2DStateNormal);

export { World2DStateNormal };
