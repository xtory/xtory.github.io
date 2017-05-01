import { CameraState } from './camera-state';
import { InheritanceHelper } from '../../bases/helpers/inheritance-helper';

//
// Constructor.
//
function CameraStateStill(_camera) {
    //
    CameraState.call(this, _camera);
}

InheritanceHelper.inherit(CameraStateStill, CameraState);

export { CameraStateStill };
