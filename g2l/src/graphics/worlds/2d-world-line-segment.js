import { JSHelper }    from '../../helpers/js-helper';
import { Vector2D }    from '../../math/2d-vector';
import { World2DItem } from './2d-world-item';

//
// Constructor.
//
function World2DLineSegment(_world) {
    //
    World2DItem.call(this, _world);

    var _self;

    try {
        //
        _self = this;

    } catch (e) {
        //
        console.log('g2l.World2DLineSegment: ' + e);

        throw e;
    }
}

JSHelper.inherit(World2DLineSegment, World2DItem);

Object.freeze(World2DLineSegment);

export { World2DLineSegment };
