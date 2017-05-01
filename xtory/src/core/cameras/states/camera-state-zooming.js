import { CameraState }      from './camera-state';
import { CameraStateStill } from './camera-state-still';
import { EaseMode }         from '../../time/ease-mode';
import { JSHelper }         from '../../base/helpers/js-helper';
import { SineEase }         from '../../time/sine-ease';

//
// Constructor.
//
function CameraStateZooming (
    _camera,
    _distance,
    _duration,
    _updatingCallback,
    _finishingCallback
){
    CameraState.call(this, _camera);

    var _self;
    var _sineEase;
    var _zoomedDistance;

    try {
        //
        _self = this;
        _zoomedDistance = 0;

        _sineEase = new SineEase(EaseMode.EASE_OUT, _duration, false);
        _sineEase.start();

    } catch (e) {
        //
        console.log('xtory.core.CameraStateZooming: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'sineEase', {
        get: function() { return _sineEase; }
    });

    Object.defineProperty(_self, 'distance', {
        get: function() { return _distance; }
    });

    Object.defineProperty(_self, 'zoomedDistance', {
        get: function() { return _zoomedDistance; },
        set: function(value) { _zoomedDistance = value; }
    });

    Object.defineProperty(_self, 'updatingCallback', {
        get: function() { return _updatingCallback; }
    });

    Object.defineProperty(_self, 'finishingCallback', {
        get: function() { return _finishingCallback; }
    });
}

JSHelper.inherit(CameraStateZooming, CameraState);

//
// Prototype.
//
CameraStateZooming.prototype.update = function() {
    //
    var sineEase = this.sineEase;

    var isFinished = sineEase.isFinished;
    var ratio = sineEase.ratioOfCurrentToTotalSineOfAngleOffset;

    if (this.updatingCallback !== undefined) {
        this.updatingCallback(sineEase.ratioOfCurrentToTotalTimeOffset);
    }

    var distance = this.distance * ratio;
    this.camera.baseZoom(distance - this.zoomedDistance);

    this.zoomedDistance = distance;

    if (isFinished === true) {
        //
        if (this.finishingCallback !== undefined) {
            this.finishingCallback();
        }

        this.camera.state = new CameraStateStill(this.camera);
    }
};

export { CameraStateZooming };
