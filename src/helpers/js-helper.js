// define ([
//     // No parameters.
// ], function (
//     // No parameters.
// ){
//     "use strict";
    
//
// Constructor.
//
function JSHelper() {
    // No contents.
}

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

//     return JSHelper;
// });

export { JSHelper };
