define ([
    // No parameters.
], function (
    // No parameters.
){
    "use strict";
    
    function ShaderType() {
        // No contents.
    }

    Object.defineProperty(ShaderType, "vertexShader", {
        get: function() { return 0; }
    });

    Object.defineProperty(ShaderType, "fragmentShader", {
        get: function() { return 1; }
    });

    return ShaderType;
});
