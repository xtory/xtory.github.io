//
// Constructor.
//
function ClearOptions() {
    // No contents.
}

//
// Static constants.
//
ClearOptions.COLOR_BUFFER   = 0x4000; // = gl.COLOR_BUFFER_BIT
ClearOptions.DEPTH_BUFFER   = 0x0100; // = gl.DEPTH_BUFFER_BIT
ClearOptions.STENCIL_BUFFER = 0x0400; // = gl.STENCIL_BUFFER_BIT

export { ClearOptions };
