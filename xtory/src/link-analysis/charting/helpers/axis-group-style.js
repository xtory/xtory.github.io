//
// Constructor.
//
function AxisGroupStyle() {
    //
    var g2l = gorilla.graphicsLibrary;

    this.lineSegmentColor = new g2l.Color(0, 0, 0, 0.125);
    this.lineSegmentThicknesss = 5.0; // in world space.
}

AxisGroupStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof AxisGroupStyle) === false ||
        (style2 instanceof AxisGroupStyle) === false) {
        return false;
    }

    if (gorilla.graphicsLibrary.Color.areEqual(style1.lineSegmentColor, style2.lineSegmentColor) === false ||
        style1.lineSegmentThicknesss !== style2.lineSegmentThicknesss) {
        //
        return false;

    } else {
        //
        return true;
    }
};

export { AxisGroupStyle };
