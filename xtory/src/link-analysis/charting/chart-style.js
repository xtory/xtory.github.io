//
// Constructor.
//
function ChartStyle() {
    //
    this.boundsLinkScreenThicknesses = true;
    this.minLinkScreenThickness      = 1.5;
    this.maxLinkScreenThickness      = 30.0;
}

ChartStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof ChartStyle) === false ||
        (style2 instanceof ChartStyle) === false) {
        return false;
    }

    if (style1.boundsLinkScreenThicknesses !== style2.boundsLinkScreenThicknesses ||
        style1.minLinkScreenThickness !== style2.minLinkScreenThickness ||
        style1.maxLinkScreenThickness !== style2.maxLinkScreenThickness) {
        //
        return false;

    } else {
        //
        return true;
    }
};

export { ChartStyle };
