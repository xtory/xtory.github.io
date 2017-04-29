import { EaseMode }           from '../../../time/ease-mode';
import { JSHelper }           from '../../../helpers/js-helper';
import { SineEase }           from '../../../time/sine-ease';
import { Size2D }             from '../../2d-size';
import { Vector2D }           from '../../../math/2d-vector';
import { World2DState }       from './2d-world-state';
import { World2DStateNormal } from './2d-world-state-normal';

//
// Constructor.
//
function World2DStateZoomingAtScreenPosition (
    _world,
    _screenPosition,
    _newSize,  // in world space.
    _duration, // in milliseconds.
    _updatingCallback,
    _finishingCallback
){
    World2DState.call(this, _world);

    var _self;
    var _sineEase;
    var _oldSize; // in world space.

    try {
        //
        _self = this;

        Object.defineProperty(_self, 'screenPosition', {
            get: function() { return _screenPosition; }
        });

        _oldSize = _world.size;

        Object.defineProperty(_self, 'oldSize', {
            get: function() { return _oldSize; }
        });

        Object.defineProperty(_self, 'newSize', {
            get: function() { return _newSize; }
        });

        Object.defineProperty(_self, 'updatingCallback', {
            get: function() { return _updatingCallback; }
        });

        Object.defineProperty(_self, 'finishingCallback', {
            get: function() { return _finishingCallback; }
        });

        _sineEase = new SineEase(EaseMode.EASE_OUT, _duration, false);
        _sineEase.start();

        Object.defineProperty(_self, 'sineEase', {
            get: function() { return _sineEase; }
        });

    } catch (e) {
        //
        console.log('xtory.graphicsLibrary.World2DStateZoomingAtScreenPosition: ', e);

        throw e;
    }
}

JSHelper.inherit(World2DStateZoomingAtScreenPosition, World2DState);

World2DStateZoomingAtScreenPosition.prototype.update = function() {
    //
    var isFinished = this.sineEase.isFinished;
    var ratio = this.sineEase.ratioOfCurrentToTotalSineOfAngleOffset;

    if (this.updateCallback !== undefined) {
        this.updatingCallback(_sineEase.ratioOfCurrentToTotalTimeOffset);
    }
    
    var size = ( // in world space.
        // Part 1.
        (isFinished === false) ?
        // Part 2.
        Size2D.addSizes (
            this.oldSize,
            Size2D.multiplySizeByScalar (
                Size2D.subtractSizes(this.newSize, this.oldSize),
                ratio
            )
         ) : 
         // Part 3.
        this.newSize
    );

    var canvasCenterPosition = // in world space.
        this.world.centerPosition; //base.Canvas.CenterPosition;

    //var p = base.Canvas.ToWorldSpace(this.screenPosition);
    var p = this.world.convertPositionFromScreenToWorldSpace(this.screenPosition);

    //base.Canvas.SetBounds(canvasCenterPosition, size);
    this.world.setBounds(canvasCenterPosition, size);

    var positionOffset = Vector2D.subtractVectors (
        this.world.convertPositionFromScreenToWorldSpace(this.screenPosition),
        p
    );

    //canvasCenterPosition -= positionOffset;
    canvasCenterPosition =
        Vector2D.subtractVectors(canvasCenterPosition, positionOffset);

    this.world.setBounds(canvasCenterPosition, size);
    
    if (isFinished === true) {
        //
        if (this.finishingCallback !== undefined) {
            this.finishingCallback();
        }

        this.world.state = new World2DStateNormal(this.world);
    }
};

export { World2DStateZoomingAtScreenPosition };
