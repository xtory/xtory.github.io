//
// Constructor.
//
function Program(_loader) {
    //
    var _webGLProgram;

    try {
        //
        _webGLProgram = _loader.gl.createProgram();

    } catch (e) {
        //
        console.log('g2l.Program: '+ e);

        throw e;
    }

    //
    // Properties.
    //
    Object.defineProperty(this, 'loader', {
        'get': function() { return _loader; }
    });

    Object.defineProperty(this, 'webGLProgram', {
        'get': function() { return _webGLProgram; }
    });
}

Object.freeze(Program);

export { Program };
