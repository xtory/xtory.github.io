define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    function ShaderType() {
        // No contents.
    }

    Object.defineProperty(ShaderType, "VERTEX_SHADER", {
        get: function() { return 0; }
    });

    Object.defineProperty(ShaderType, "FRAGMENT_SHADER", {
        get: function() { return 1; }
    });

    return ShaderType;
});
