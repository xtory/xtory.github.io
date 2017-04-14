import { Vector2D } from '../../math/2d-vector';
import { World2DLayerName } from './2d-world-layer-name';

//
// Constructor.
//
function World2D(_renderer, _style) {
    //
    var _self;
    var _spriteBatch;

    //
    // Bounds.
    //
    // Note:
    // 'CenterPosition' here means: the center position of this canvas 'in world
    // space'.
    var _centerPosition; // which will be set before continuing.

    // Note:
    // 'Size' here means: the size of this canvas 'in world space'.
    var _size; // which will be set before continuing.

    // Note:
    // The scale factor of world to screen.
    var _worldToScreenScaleFactor;

    var _layers;

    var _hasToUpdateItems;
    var _drawnImageCount;
    var _drawnLineSegmentCount;
    var _lastDrawnItem;

    try {
        //
        _self = this;

        _worldToScreenScaleFactor = 1.0;

        _hasToUpdateItems = false;

    } catch (e) {
        //
        console.log('g2l.World2D: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'renderer', {
        'get': function() { return _renderer; }
    });

    //
    // Priviledged methods.
    //
    this.invalidateItems = function() {
        //
        _hasToUpdateItems = true;
    };
}

//
// Static constants (after Object.freeze()).
//
World2D.DEFAULT_LINE_SEGMENT_LAYER_INDEX = World2DLayerName.LINE_SEGMENTS_BELOW_FAR_IMAGES;
World2D.DEFAULT_IMAGE_LAYER_INDEX = World2DLayerName.MIDDLE_IMAGES;

Object.freeze(World2D);

export { World2D };
