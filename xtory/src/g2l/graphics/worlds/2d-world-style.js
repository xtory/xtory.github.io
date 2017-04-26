import { Color } from '../color';
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

//
// Static methods.
//
World2DStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof World2DStyle) === false ||
        (style2 instanceof World2DStyle) === false) {
        return false;
    }

    if (Color.areEqual(style1.backgroundColor, style2.backgroundColor) === false ||
        style1.zoomDuration !== style2.zoomDuration ||
        style1.zoomScaleFactor !== style2.zoomScaleFactor ||
        style1.hitLineSegmentScreenThicknessTimes !== style2.hitLineSegmentScreenThicknessTimes ||
        style1.viewMargin !== style2.viewMargin) {
        //
        return false;

    } else {
        //
        return true;
    }
}

export { World2DStyle };
