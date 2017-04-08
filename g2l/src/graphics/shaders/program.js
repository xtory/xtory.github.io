//
// Constructor.
//
function Program(_gl) {
    //
    var _webGLProgram;

    try {
        //
        _webGLProgram = _gl.createProgram();

    } catch (e) {
        //
        console.log('Program: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'gl', {
        'get': function() { return _gl; }
    });

    Object.defineProperty(this, 'webGLProgram', {
        'get': function() { return _webGLProgram; }
    });
}

Object.freeze(Program);

export { Program };
