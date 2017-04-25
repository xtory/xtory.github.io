//
// Constructor.
//
function Size2D(_width, _height) {
    //
    this.width = _width;
    this.height = _height;
}

//
// Static methods.
//
Size2D.addSizes = function(size1, size2) {
    return new Size2D(size1.width+size2.width, size1.height+size2.height);
};

Size2D.subtractSizes = function(size1, size2) {
    return new Size2D(size1.width-size2.width, size1.height-size2.height);
};

Size2D.multiplySizeByScalar = function(size, s) {
    return new Size2D(size.width*s, size.height*s);
};

Size2D.areEqual = function(size1, size2) {
    //
    if ((size1 instanceof Size2D) === false ||
        (size2 instanceof Size2D) === false) {
        return false;
    }

    if (size1.width !== size2.width ||
        size1.height !== size2.height) {
        //
        return false;

    } else {
        //
        return true;
    }
};

Object.freeze(Size2D);

export { Size2D };
