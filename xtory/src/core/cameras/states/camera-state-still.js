import { CameraState } from './camera-state';
import { JSHelper } from '../../base/helpers/js-helper';

//
// Constructor.
//
function CameraStateStill(_camera) {
    //
    CameraState.call(this, _camera);
}

JSHelper.inherit(CameraStateStill, CameraState);

export { CameraStateStill };
