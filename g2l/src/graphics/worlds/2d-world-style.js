import { Colors } from '../colors';

//
// Constructor.
//
function World2DStyle() {
    //
    this.backgroundColor                    = Colors.DEFAULT_BACKGROUND_COLOR;
    this.zoomDuration                       = 250; // in milliseconds.
    this.zoomScaleFactor                    = 2.0;
    this.hitLineSegmentScreenThicknessTimes = 5.0;
    this.viewMargin                         = 125; // in world space.
}

Object.freeze(World2DStyle);

export { World2DStyle };
