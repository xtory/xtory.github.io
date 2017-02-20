define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";

    //
    // Constructor.
    //
    function ShaderType() {
        // No contents.
    }

    //
    // Constants.
    //
    Object.defineProperty(ShaderType, "VERTEX_SHADER", {
        get: function() { return 0; }
    });

    Object.defineProperty(ShaderType, "FRAGMENT_SHADER", {
        get: function() { return 1; }
    });

    return ShaderType;
});
