define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    //
    // Constructor.
    //
    function ExceptionHelper() {
        // No contents.
    }

    //
    // Static methods.
    //
    ExceptionHelper.displayMessageOf = function(e) {
        //
        if (typeof(e) === "string") {
            alert(e);
        } else {
            alert("An unknown-type exception raised.");
        }
    }

    return ExceptionHelper;
});
