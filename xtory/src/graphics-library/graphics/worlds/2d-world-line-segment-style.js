//
// Constructor.
//
function World2DLineSegmentStyle() {
    //
    this.boundsScreenThickness = false;
    this.minScreenThickness    = 0;
    this.maxScreenThickness    = Number.MAX_VALUE;
}

//
// Static methods.
//
World2DLineSegmentStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof World2DLineSegmentStyle) === false ||
        (style2 instanceof World2DLineSegmentStyle) === false) {
        return false;
    }

    if (style1.boundsScreenThickness !== style2.boundsScreenThickness ||
        style1.minScreenThickness !== style2.minScreenThickness ||
        style1.maxScreenThickness !== style2.maxScreenThickness) {
        //
        return false;

    } else {
        //
        return true;
    }
}

export { World2DLineSegmentStyle };
