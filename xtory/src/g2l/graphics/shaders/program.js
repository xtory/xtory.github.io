//
// Constructor.
//
function Program(_programLoader) {
    //
    var _self;
    var _gl;
    var _webGLProgram;

    try {
        //
        _self = this;
        _gl = _programLoader.loader.renderer.gl;

        _webGLProgram = _gl.createProgram();

    } catch (e) {
        //
        console.log('g2l.Program: ' + e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(_self, 'programLoader', {
        get: function() { return _programLoader; }
    });

    Object.defineProperty(_self, 'webGLProgram', {
        get: function() { return _webGLProgram; }
    });
}

Object.freeze(Program);

export { Program };
