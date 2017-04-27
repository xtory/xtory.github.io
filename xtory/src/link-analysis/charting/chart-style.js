//
// Constructor.
//
function ChartStyle() {
    //
    //this.vertexSpacing = 150.0;
}

ChartStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof ChartStyle) === false ||
        (style2 instanceof ChartStyle) === false) {
        return false;
    }

    // if (style1.vertexSpacing !== style2.vertexSpacing) {
    //     //
    //     return false;

    // } else {
    //     //
    //     return true;
    // }

    return true;
};

export { ChartStyle };
