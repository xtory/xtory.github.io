import { InheritanceHelper } from '../../../base/helpers/inheritance-helper';
import { World2DState } from './2d-world-state';

//
// Constructor.
//
function World2DStateNormal(_world) {
    //
    World2DState.call(this, _world);
}

InheritanceHelper.inherit(World2DStateNormal, World2DState);

export { World2DStateNormal };
