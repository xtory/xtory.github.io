import { JSHelper }    from '../../helpers/js-helper';
import { Vector2D }    from '../../math/2d-vector';
import { World2DItem } from './2d-world-item';

//
// Constructor.
//
function World2DImage (
    _world,
    _texture,
    _centerPosition, // in world space.
    _size            // in world space.
){
    World2DItem.call(this, _world);

    var _self;

    try {
        //
        _self = this;

    } catch (e) {
        //
        console.log('g2l.World2DImage: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'texture', {
        'get': function() { return _texture; },
        'set': function(value) { _texture = value; }
    });

    // Note:
    // 'centerPosition' here means the center position of this image "in world
    // space".
    Object.defineProperty(_self, 'centerPosition', {
        //
        'get': function() {
            //
            return _centerPosition;
        },

        'set': function(value) {
            //
            if (Vector2D.areEqual(value, _centerPosition) === true) {
                return;
            }

            _centerPosition = value;

            // Calculates the center position in screen space as well.
            _centerScreenPosition = _self.world.toScreenSpace(_centerPosition);

            // Test:
            _self.world.invalidateBounds();
            // :Test
        }
    });
}

JSHelper.inherit(World2DImage, World2DItem);

Object.freeze(World2DImage);

export { World2DImage };
