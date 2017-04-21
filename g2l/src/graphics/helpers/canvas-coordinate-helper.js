//
// Constructor.
//
function CanvasCoordinateHelper() {
    // No contents.
}

//
// Static methods.
//
CanvasCoordinateHelper.fromDisplayToDrawSpace = function(canvas, p) {
    //
    return {
        x: (p.x / canvas.clientWidth) * canvas.width,
        y: (p.y / canvas.clientHeight) * canvas.height
    };
};

CanvasCoordinateHelper.fromDrawToDisplaySpace = function(canvas, p) {
    //
    return {
        x: (p.x / canvas.width) * canvas.clientWidth,
        y: (p.y / canvas.height) * canvas.clientHeight
    };
};

Object.freeze(CanvasCoordinateHelper);

export { CanvasCoordinateHelper };
