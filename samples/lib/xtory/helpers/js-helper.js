"use strict";

define ([
    // No parameters.
], function (
    // No parameters.
){
    function JSHelper() {
        // No contents.
    }

    //
    // Static methods.
    //
    JSHelper.isNullOrUndefined = function(value) {
        //
        if (value === null ||
            value === undefined) {
            return true;
        } else {
            return false;
        }
    }

    return JSHelper;
});
