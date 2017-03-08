//
// Constructor.
//
function Color(r, g, b, a) {
    //
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

//
// Prototype.
//
Color.prototype = {
    //
    // Public methods.
    //
    toArray: function() {
        return [ this.r, this.g, this.b, this.a ];
    }
};

Object.freeze(Color);

export { Color };
