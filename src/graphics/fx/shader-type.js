// define ([
//     // No parameters.
// ], function (
//     // No parameters.
// ){
//     "use strict";

//
// Constructor.
//
function ShaderType() {
    // No contents.
}

//
// Static constants (after Object.freeze()).
//
ShaderType.VERTEX_SHADER = 0;
ShaderType.FRAGMENT_SHADER = 1;

Object.freeze(ShaderType);

//     return ShaderType;
// });

export { ShaderType };
