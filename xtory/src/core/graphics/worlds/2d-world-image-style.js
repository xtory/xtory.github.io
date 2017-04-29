import { Size2D } from '../2d-size';

//
// Constructor.
//
function World2DImageStyle() {
    //
    this.boundsScreenSize = false;
    this.minScreenSize    = new Size2D(0, 0);
    this.maxScreenSize    = new Size2D(Number.MAX_VALUE, Number.MAX_VALUE);
}

//
// Static methods.
//
World2DImageStyle.areEqual = function(style1, style2) {
    //
    if ((style1 instanceof World2DImageStyle) === false ||
        (style2 instanceof World2DImageStyle) === false) {
        return false;
    }

    if (style1.boundsScreenSize !== style2.boundsScreenSize ||
        Size2D.areEqual(style1.minScreenSize, style2.minScreenSize) === false ||
        Size2D.areEqual(style1.maxScreenSize, style2.maxScreenSize) === false) {
        //
        return false;

    } else {
        //
        return true;
    }
}

export { World2DImageStyle };
