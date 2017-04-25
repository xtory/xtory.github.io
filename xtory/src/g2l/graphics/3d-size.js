//
// Constructor.
//
function Size3D(_width, _height, _depth) {
    //
    this.width  = _width;
    this.height = _height;
    this.depth  = _depth;
}

Object.freeze(Size3D);

export { Size3D };
