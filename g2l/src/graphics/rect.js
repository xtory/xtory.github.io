import { Vector2D } from '../math/2d-vector';

// Note:
// GDI+'s Rectangle and WPF's Rect are both (left, top, width, height). But cuz
// OpenGL's texture coordinates is from lower-left (0, 0) to upper-right (1, 1),
// this engine uses Rect: (left, bottom, width, height).

//
// Constructor.
//
function Rect(_left, _bottom, _width, _height) {
    //
    this.left   = _left;
    this.bottom = _bottom;
    this.width  = _width;
    this.height = _height;
}

Object.defineProperty(Rect.prototype, 'right', {
    'get': function() { return this.left + this.width; }
});

Object.defineProperty(Rect.prototype, 'top', {
    'get': function() { return this.bottom + this.height; }
});

Object.defineProperty(Rect.prototype, 'center', {
    //
    'get': function() {
        //
        return new Vector2D (
            this.left + this.width * 0.5,
            this.bottom + this.height * 0.5
        );
    }
});

Object.defineProperty(Rect.prototype, 'size', {
    //
    'get': function() { return new Vector2D(this.width, this.height); }
});

Rect.areEqual = function(rect1, rect2) {
    //
    if ((rect1 instanceof Rect) === false ||
        (rect2 instanceof Rect) === false) {
        return false;
    }

    if (rect1.left   !== rect2.left ||
        rect1.bottom !== rect2.bottom ||
        rect1.width  !== rect2.width ||
        rect1.height !== rect2.height) {
        //
        return false;

    } else {
        //
        return true;
    }
};

Object.freeze(Rect);

export { Rect };
