//
// Constructor.
//
function JSHelper() {
    // No contents.
}

//
// Prototype.
//
JSHelper.prototype = {
    // No contents.
};

//
// Static methods.
//
JSHelper.isUndefinedOrNull = function(value) {
    //
    if (value === undefined ||
        value === null) {
        return true;
    } else {
        return false;
    }
}

Object.freeze(JSHelper);

export { JSHelper };
