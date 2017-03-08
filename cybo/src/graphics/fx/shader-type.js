//
// Constructor.
//
function ShaderType() {
    // No contents.
}

//
// Prototype.
//
ShaderType.prototype = {
    // No contents.
};

//
// Static constants (after Object.freeze()).
//
ShaderType.VERTEX_SHADER = 0;
ShaderType.FRAGMENT_SHADER = 1;

Object.freeze(ShaderType);

export { ShaderType };
