//
// Constructor.
//
function Program(_programLoader) {
    //
    var _gl;
    var _webGLProgram;

    try {
        //
        _gl = _programLoader.loader.renderer.gl;

        _webGLProgram = _gl.createProgram();

    } catch (e) {
        //
        console.log('g2l.Program: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'programLoader', {
        'get': function() { return _programLoader; }
    });

    Object.defineProperty(this, 'webGLProgram', {
        'get': function() { return _webGLProgram; }
    });
}

Object.freeze(Program);

export { Program };
