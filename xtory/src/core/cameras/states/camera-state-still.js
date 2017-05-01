import { CameraState } from './camera-state';
import { InheritanceHelper } from '../../base/helpers/inheritance-helper';

//
// Constructor.
//
function CameraStateStill(_camera) {
    //
    CameraState.call(this, _camera);
}

InheritanceHelper.inherit(CameraStateStill, CameraState);

export { CameraStateStill };
