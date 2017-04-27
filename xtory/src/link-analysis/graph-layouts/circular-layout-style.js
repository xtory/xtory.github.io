//
// Constructor.
//
function CircularLayoutStyle() {
    //
    this.vertexSpacing = CircularLayoutStyle.DEFAULT_VERTEX_SPACING; // = 150.0
}

CircularLayoutStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof CircularLayoutStyle) === false ||
        (style2 instanceof CircularLayoutStyle) === false) {
        return false;
    }

    if (style1.vertexSpacing !== style2.vertexSpacing) {
        //
        return false;

    } else {
        //
        return true;
    }
};

// Static constants.
CircularLayoutStyle.DEFAULT_VERTEX_SPACING = 150.0;

export { CircularLayoutStyle };
