import { Camera }             from './camera';
import { CameraState }        from './states/camera-state';
import { CameraStateStill }   from './states/camera-state-still';
import { CameraStateZooming } from './states/camera-state-zooming';
import { InheritanceHelper }  from '../base/helpers/inheritance-helper';

//
// Constructor.
//
function SmoothCamera (
    _renderer,
    _position,
    _facingDirection,
    _upDirection,
    _distanceToNearPlane,
    _distanceToFarPlane
){
    Camera.call (
        this,
        _renderer,
        _position, _facingDirection, _upDirection,
        _distanceToNearPlane, _distanceToFarPlane
    );

    var _self;
    var _state;
    var _zoomingDuration;
        
    try {
        //
        _self = this;

        _state = new CameraStateStill(_self);

        _zoomingDuration = SmoothCamera.DEFAULT_ZOOM_DURATION;
        
    } catch (e) {
        //
        console.log('xtory.core.SmoothCamera: ', e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'state', {
        //
        get: function() {
            return _state;
        },

        set: function(value) {
            //
            if (value === _state) {
                return;
            }

            // ...

            _state = value;
        }
    });

    Object.defineProperty(_self, 'zoomingDuration', {
       get: function() { return _zoomingDuration; },
       set: function(value) { _zoomingDuration = value; }
    });

    //
    // Privileged methods.
    //
    this.update = function() {
        //
        _state.update();
    };

    this.zoom = function(distance) {
        //
        if ((_state instanceof CameraStateZooming) === true) {
            return;
        }

        _self.state = new CameraStateZooming (
            _self,
            distance,
            _zoomingDuration
        );
    };

    this.baseZoom = function(distance) {
        //
        Camera.prototype.zoom.call(_self, distance);
    };
}

InheritanceHelper.inherit(SmoothCamera, Camera);

//
// Static constants.
//
SmoothCamera.DEFAULT_ZOOM_DURATION = 250; // milliseconds.

export { SmoothCamera };
