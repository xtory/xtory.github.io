"use strict";

function JSHelper() {
    // No contents.
}

//
// Static methods.
//
JSHelper.isUndefinedOrNull = function(value) {
    //
    if (value === null ||
        value === undefined) {
        return true;
    } else {
        return false;
    }
}
